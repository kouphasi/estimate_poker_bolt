import { Database } from './database.types';
import { v4 as uuidv4 } from 'uuid';
import { User } from '@supabase/supabase-js';

// Type definitions for mimicking Supabase client
type StorageTables = keyof Database['public']['Tables'];
type StorageTablesData<T extends StorageTables> = Database['public']['Tables'][T]['Row'][];
type ChannelCallback = () => void;

interface StorageData {
  projects: Database['public']['Tables']['projects']['Row'][];
  tasks: Database['public']['Tables']['tasks']['Row'][];
  estimations: Database['public']['Tables']['estimations']['Row'][];
}

interface ChannelSubscription {
  id: string;
  table: string;
  filter: string;
  callback: ChannelCallback;
}

interface AuthData {
  user: User | null;
  listeners: ((user: User | null) => void)[];
}

// Local database implementation
class LocalDatabase {
  private storage: StorageData;
  private channels: ChannelSubscription[];
  private authData: AuthData;

  constructor() {
    // Initialize or load data from localStorage
    const savedData = localStorage.getItem('estimatePokerData');
    this.storage = savedData 
      ? JSON.parse(savedData) 
      : { projects: [], tasks: [], estimations: [] };

    this.channels = [];
    
    // Initialize auth data
    const savedAuthData = localStorage.getItem('estimatePokerAuth');
    this.authData = savedAuthData 
      ? JSON.parse(savedAuthData) 
      : { user: null, listeners: [] };
  }

  // Save data to localStorage
  private saveData(): void {
    localStorage.setItem('estimatePokerData', JSON.stringify(this.storage));
  }

  // Save auth data to localStorage
  private saveAuthData(): void {
    localStorage.setItem('estimatePokerAuth', JSON.stringify(this.authData));
  }

  // Authentication methods
  auth = {
    // Mock sign in
    signInWithPassword: async ({ email, password }: { email: string; password: string }) => {
      const mockUser = {
        id: 'local-user-id',
        email,
        created_at: new Date().toISOString(),
        aud: 'authenticated',
        role: 'authenticated',
      } as User;

      this.authData.user = mockUser;
      this.saveAuthData();
      this.authData.listeners.forEach(listener => listener(mockUser));

      return {
        data: {
          session: {
            user: mockUser
          }
        },
        error: null,
      };
    },

    // Mock sign out
    signOut: async () => {
      this.authData.user = null;
      this.saveAuthData();
      this.authData.listeners.forEach(listener => listener(null));

      return {
        error: null,
      };
    },

    // Get current session
    getSession: async () => {
      return {
        data: {
          session: this.authData.user ? {
            user: this.authData.user
          } : null
        },
        error: null,
      };
    },

    // Auth state change subscription
    onAuthStateChange: (callback: (event: string, session: any) => void) => {
      const listener = (user: User | null) => {
        callback(user ? 'SIGNED_IN' : 'SIGNED_OUT', user ? { user } : null);
      };
      this.authData.listeners.push(listener);
      
      return {
        data: {
          subscription: {
            unsubscribe: () => {
              this.authData.listeners = this.authData.listeners.filter(l => l !== listener);
            }
          }
        }
      };
    }
  };

  // Database table operations
  from = <T extends StorageTables>(table: T) => {
    return {
      select: (selection: string = '*') => {
        // Handle JOIN query with special syntax for projects!inner(*)
        if (selection.includes('projects!inner(*)')) {
          return {
            eq: (field: string, value: any) => {
              const filteredData = this.storage[table].filter(item => item[field as keyof typeof item] === value);
              
              if (filteredData.length === 0) {
                return Promise.resolve({
                  data: null,
                  error: null,
                });
              }
              
              // Join with projects
              const joinedData = filteredData.map(item => {
                const projectId = (item as any).project_id;
                const project = this.storage.projects.find(p => p.id === projectId);
                
                return {
                  ...item,
                  projects: project,
                };
              });
              
              return {
                single: () => {
                  return Promise.resolve({
                    data: joinedData[0],
                    error: null,
                  });
                }
              };
            }
          };
        }
        
        return {
          eq: (field: string, value: any) => {
            return {
              order: (orderField: string, { ascending }: { ascending: boolean }) => {
                const filteredData = this.storage[table].filter(item => item[field as keyof typeof item] === value);
                const sortedData = [...filteredData].sort((a, b) => {
                  const aValue = a[orderField as keyof typeof a];
                  const bValue = b[orderField as keyof typeof b];
                  
                  if (typeof aValue === 'string' && typeof bValue === 'string') {
                    return ascending 
                      ? aValue.localeCompare(bValue) 
                      : bValue.localeCompare(aValue);
                  }
                  
                  return ascending 
                    ? (aValue < bValue ? -1 : 1) 
                    : (bValue < aValue ? -1 : 1);
                });
                
                return Promise.resolve({
                  data: sortedData,
                  error: null,
                });
              },
              single: () => {
                const filtered = this.storage[table].filter(item => item[field as keyof typeof item] === value);
                return Promise.resolve({
                  data: filtered.length > 0 ? filtered[0] : null,
                  error: null,
                });
              }
            };
          },
          order: (orderField: string, { ascending }: { ascending: boolean }) => {
            const sortedData = [...this.storage[table]].sort((a, b) => {
              const aValue = a[orderField as keyof typeof a];
              const bValue = b[orderField as keyof typeof b];
              
              if (typeof aValue === 'string' && typeof bValue === 'string') {
                return ascending 
                  ? aValue.localeCompare(bValue) 
                  : bValue.localeCompare(aValue);
              }
              
              return ascending 
                ? (aValue < bValue ? -1 : 1) 
                : (bValue < aValue ? -1 : 1);
            });
            
            return Promise.resolve({
              data: sortedData,
              error: null,
            });
          }
        };
      },
      insert: (items: any[]) => {
        return {
          select: () => {
            const newItems = items.map(item => {
              const timestamp = new Date().toISOString();
              return {
                id: item.id || uuidv4(),
                created_at: item.created_at || timestamp,
                ...item,
              };
            });

            this.storage[table] = [...this.storage[table], ...newItems];
            this.saveData();

            // Trigger any subscriptions for this table
            this.triggerChannels(table);

            return {
              single: () => {
                return Promise.resolve({
                  data: newItems[0],
                  error: null,
                });
              },
              data: newItems,
              error: null,
            };
          }
        };
      },
      update: (updateData: any) => {
        return {
          eq: (field: string, value: any) => {
            const index = this.storage[table].findIndex(item => item[field as keyof typeof item] === value);
            
            if (index !== -1) {
              this.storage[table][index] = {
                ...this.storage[table][index],
                ...updateData,
              };
              this.saveData();

              // Trigger any subscriptions for this table
              this.triggerChannels(table);
            }
            
            return Promise.resolve({
              data: index !== -1 ? this.storage[table][index] : null,
              error: null,
            });
          }
        };
      },
      delete: () => {
        return {
          eq: (field: string, value: any) => {
            const index = this.storage[table].findIndex(item => item[field as keyof typeof item] === value);
            
            if (index !== -1) {
              const deletedItem = this.storage[table][index];
              this.storage[table] = this.storage[table].filter(item => item[field as keyof typeof item] !== value);
              this.saveData();

              // Trigger any subscriptions for this table
              this.triggerChannels(table);
              
              return Promise.resolve({
                data: deletedItem,
                error: null,
              });
            }
            
            return Promise.resolve({
              data: null,
              error: null,
            });
          }
        };
      }
    };
  };

  // Realtime subscriptions
  channel = (channelName: string) => {
    return {
      on: (
        event: string,
        config: { event: string; schema: string; table: string; filter: string },
        callback: ChannelCallback
      ) => {
        const channelId = uuidv4();
        this.channels.push({
          id: channelId,
          table: config.table,
          filter: config.filter,
          callback,
        });
        
        return {
          subscribe: () => {
            // Initial trigger not needed as it's handled in the component's useEffect
            return channelId;
          }
        };
      }
    };
  };

  removeChannel = (channelId: string) => {
    this.channels = this.channels.filter(channel => channel.id !== channelId);
  };

  // Trigger channel callbacks for a specific table
  private triggerChannels(table: string) {
    this.channels
      .filter(channel => channel.table === table)
      .forEach(channel => channel.callback());
  }
}

// Export a singleton instance
export const localDatabase = new LocalDatabase();