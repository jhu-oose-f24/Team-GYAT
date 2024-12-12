## Design
We believe that no major refactoring needs to be done to our application, as it adheres to the SOLID design principles to the best of its ability (while maintaining the same functionality). Our application is relatively a simple one: we have Users, Jobs, Tags, Conversations, and Messages. The User can be associated with many Jobs, and each Job can have one User attached to it as a Provider, and a different User attached to it as a Requester. Additionally, each Job can have a single Tag associated with it. Conversations are allowed between two different Users and can have multiple Messages, and Users can have multiple Conversations. The relatively simple nature of our application allows each class to serve a single purpose. Our design allows for extensibility without modifying existing code. For instance: Adding new types of tags, user roles, or job features can be accomplished by extending the existing classes or introducing new subclasses.

## Complexity
The codebase demonstrates a high level of modularity and organization, which helps to manage complexity effectively by adhering to best practices and employing a clear separation of concerns.

1. Database Queries: The use of SQLAlchemy ORM for database operations simplifies the complexity of direct SQL queries while ensuring code remains intuitive and expressive. Queries involving relationships, such as fetching conversations or participants, are well-structured and leverage ORM features effectively.
2. Route Handlers: Each route handler is concise and focused on a single responsibility, such as creating a conversation, managing participants, or fetching jobs. This adherence to the single-responsibility principle ensures that each function is easy to understand and debug. Error handling is implemented across route handlers to manage unexpected inputs or operations gracefully, maintaining application stability.
3. File and Media Management: The integration with AWS S3 for file uploads and management in the backend is handled cleanly, leveraging S3's features for storage and retrieval. 
4. Error Handling: The use of try-except blocks in critical operations, such as database commits and external service interactions, ensures the system handles edge cases and unexpected errors gracefully. 
5. Frontend and Backend Integration: The clear delineation between backend API routes and frontend components enables smooth communication between the two layers. Backend routes provide well-defined endpoints, while frontend components consume these APIs with clear, predictable logic.

## Tests
At present, our application does not include automated tests. While the codebase has been tested manually during development and debugging processes, there is no formal automated testing framework in place to ensure consistent and repeatable validation of functionality. If we had enough time going forward to implement Tests, we would consider using the following:

Pytest or Unittest for testing Flask API routes and database interactions.

Jest and React Testing Library for testing React components.

## Naming
Naming is overall a pretty strong aspect in our codebase. On the backend, variable, method, and class names are all clear and are highly correlated to what that specific data type does. Across the APIs, even with different people working on separate endpoints, naming conventions are relatively consistent and meaningful. This is the same on the other side of the stack, the front end. Our components are clearly named with the part of the website they represent. For example, NavBar, SearchBar, PendingJobs, and GoogleAuthButtons are self-explanatory names, making components inserted highly readable and easier to understand. Specifically on the frontend, our team stuck to general best practice guidelines for state management. handleConnect() in NavBar, handleSubmit() and handleFileChange() in CreateJob. Overall, even with a team of 6 people. we were able to have meaningful and relatively consistent variable, method, component, and class methods.

## Comments
Comments were probably not a strong suit in our codebase for the majority of the semester. However, as we iteratively refined our functionality and codebase, the comments started to become more insightful and impactful. We give Thomas gets a lot of credit for this as he went through the frontend components and backend structure and created clear, concise comments. With descriptions not only of the functionality of a method but also of what the parameters mean, our codebase can now be understood much faster. One of, if not the most important parts of good commenting is keeping them concise. Lengthy comments are counter-productive as they just lack clarity as they are filled with fluff. We think the strongest part of our commenting lies in their conciseness. It is hard to write concise comments that clearly convey the main aspect of the portion of the code it is describing, but by being diligent with this, we greatly have increased the readability and how easy it is for outsiders to understand our codebase.

## Style

## Documentation
