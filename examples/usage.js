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
    const response = await api.users.find().execute();
    console.log(`Found ${response.data.length} users`);
    console.log('Response headers:', response.headers);

    // Find with criteria
    console.log('Finding active users...');
    const activeResponse = await api.users.find({ active: true }).execute();
    console.log(`Found ${activeResponse.data.length} active users`);

    // Pagination and sorting
    console.log('Finding paginated and sorted users...');
    const paginatedResponse = await api.users
      .find()
      .limit(10)
      .skip(20)
      .sort('createdAt DESC')
      .execute();
    console.log(`Found ${paginatedResponse.data.length} paginated users`);

    // Find one by ID
    console.log('Finding user with ID 1...');
    const userResponse = await api.users.findOne(1);
    console.log('Found user:', userResponse.data);
    console.log('User response headers:', userResponse.headers);

    // Create a new user
    console.log('Creating a new user...');
    const createResponse = await api.users.create({
      name: 'John Doe',
      email: 'john@example.com',
      role: 'user'
    });
    console.log('Created new user:', createResponse.data);
    console.log('Creation response headers:', createResponse.headers);

    // Update a user
    console.log('Updating user...');
    const updateResponse = await api.users.update(createResponse.data.id, {
      name: 'Jane Doe'
    });
    console.log('Updated user:', updateResponse.data);
    console.log('Update response headers:', updateResponse.headers);

    // Using complex criteria with operators
    console.log('Finding users with complex criteria...');
    const seniorResponse = await api.users
      .find({
        age: { '>': 30 },
        role: { in: ['admin', 'manager'] }
      })
      .execute();
    console.log(`Found ${seniorResponse.data.length} senior users`);

    // Using select to limit fields
    console.log('Finding users with selected fields...');
    const emailsResponse = await api.users.find().select(['id', 'email']).execute();
    console.log('User emails:', emailsResponse.data);

    // Count records
    console.log('Counting active users...');
    const countResponse = await api.users.find({ active: true }).count();
    console.log(`Found ${countResponse.data.count} active users`);
    console.log('Count response headers:', countResponse.headers);
  } catch (error) {
    console.error('Error:', error.message);
    if (error.data) {
      console.error('API error details:', error.data);
    }
    if (error.headers) {
      console.error('Error response headers:', error.headers);
    }
  }
}

main();
