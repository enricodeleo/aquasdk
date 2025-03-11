// examples/usage.js
import SDK from '../sdk/index.js';

// Initialize the SDK
const api = new SDK({
  baseUrl: 'https://api.example.com',
  auth: {
    token: 'your-auth-token'
  }
});

async function main() {
  try {
    // Basic usage examples

    // Find all users
    console.log('Finding all users...');
    const users = await api.users.find().execute();
    console.log(`Found ${users.length} users`);

    // Find with criteria
    console.log('Finding active users...');
    const activeUsers = await api.users.find({ active: true }).execute();
    console.log(`Found ${activeUsers.length} active users`);

    // Pagination and sorting
    console.log('Finding paginated and sorted users...');
    const paginatedUsers = await api.users
      .find()
      .limit(10)
      .skip(20)
      .sort('createdAt DESC')
      .execute();
    console.log(`Found ${paginatedUsers.length} paginated users`);

    // Find one by ID
    console.log('Finding user with ID 1...');
    const user = await api.users.findOne(1);
    console.log('Found user:', user);

    // Create a new user
    console.log('Creating a new user...');
    const newUser = await api.users.create({
      name: 'John Doe',
      email: 'john@example.com',
      role: 'user'
    });
    console.log('Created new user:', newUser);

    // Update a user
    console.log('Updating user...');
    const updatedUser = await api.users.update(newUser.id, {
      name: 'Jane Doe'
    });
    console.log('Updated user:', updatedUser);

    // Using complex criteria with operators
    console.log('Finding users with complex criteria...');
    const seniorUsers = await api.users
      .find({
        age: { '>': 30 },
        role: { in: ['admin', 'manager'] }
      })
      .execute();
    console.log(`Found ${seniorUsers.length} senior users`);

    // Using select to limit fields
    console.log('Finding users with selected fields...');
    const userEmails = await api.users.find().select(['id', 'email']).execute();
    console.log('User emails:', userEmails);

    // Count records
    console.log('Counting active users...');
    const activeCount = await api.users.find({ active: true }).count();
    console.log(`Found ${activeCount} active users`);
  } catch (error) {
    console.error('Error:', error.message);
    if (error.data) {
      console.error('API error details:', error.data);
    }
  }
}

main();
