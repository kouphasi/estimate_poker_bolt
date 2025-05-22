# Local Database Implementation

This project now uses a local database implementation that mimics the Supabase API. It stores all data in the browser's localStorage for persistence.

## Key Features

- Uses the same API interface as Supabase for drop-in compatibility
- Stores data in localStorage for persistence between sessions
- Implements a mock authentication system
- Provides realtime subscription functionality similar to Supabase
- Seeds the database with sample data for easier testing

## Implementation Details

The local database is implemented in `src/lib/localDatabase.ts` and exposed through `src/lib/supabase.ts`, using the same interface as the original Supabase client.

### Storage Structure

The database stores data in three tables:
- projects
- tasks
- estimations

All data is serialized to JSON and stored in localStorage under the key 'estimatePokerData'.

### Authentication

The mock authentication system stores user data in localStorage under the key 'estimatePokerAuth'.

To sign in, use any email and password combination. For the local implementation, there's no actual authentication - it will create a mock user session.

### Realtime Subscriptions

The local implementation provides a mock version of Supabase's realtime subscriptions. It triggers callbacks when data changes occur to the tables you're subscribed to.

## Testing

When you first run the application, it will seed the database with a sample project and task for easier testing.

## Development

To switch back to using Supabase, you would need to modify `src/lib/supabase.ts` to use the original Supabase client instead of the local implementation.