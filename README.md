# NC News Seeding

Creating the databases
This project requires two databases:

A development database (for realistic data).
A test database (with simpler test data).

Step 1: Run the setup script
To create both databases, run:

npm run setup-dbs
This will run the setup-dbs.sql file to create both a test and development database.

Step 2: Set up environment variables
You must create two .env files for your databases:

.env.test (for the test database).
.env.development (for the development database).
Double-check that your .gitignore file includes .env.* so these files aren't pushed to GitHub.

Step 3: Verify your setup
Run the following scripts and check the console logs (you may need to scroll up a bit in the terminal!):

npm run test-seed
This runs tests for your seed function.
No tests will pass yet (which is expected), but you should see logs confirming you are connected to your test database.
npm run seed-dev
This runs the run-seed script, which calls your seed function with development data.
You will see errors at this stage, but the logs should confirm that you are connected to the development database.
Understanding the Project Structure
The db folder contains everything you need to start creating the seed function:

A data folder
This contains subfolders with the test and development data.
Each of these contains an index.js file which acts as a single entry point for all data in the folder.
When you need access to the data elsewhere, you can write one convenient require statement to the index file, rather than having to require each file individually.
Think of it like the index of a book - a place to refer to!
Make sure the index file exports an object with values of the data from that folder with the keys:
articleData
commentData
topicData
userData

A seeds folder
This contains the scripts for seeding your databases.
Any utility functions we need for data-manipulation are also found here.

Also dont forget to run "npm install" to install all the packages and dependencies for husky and tests/jest files to work locally on your machine.