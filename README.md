# 22691A0528
Overview
This project is a client-side React application that allows users to shorten up to 5 URLs at a time, set optional expiry, and choose custom shortcodes. It features robust client-side validation, user-friendly error handling, and a logging middleware for analytics, all styled with native CSS for a clean and responsive UI.

Features
Shorten up to 5 URLs concurrently

Optional validity period (defaults to 30 minutes)

Custom or auto-generated unique shortcodes

Client-side validation for URL format, validity, and shortcode uniqueness

Display of results with original URL, shortened URL, shortcode, and expiry

Robust error handling with user-friendly messages

Mandatory logging middleware (no console.log or browser logging)

Statistics page showing all logs and analytics

Client-side routing and redirection for short links

Responsive UI using only native CSS

Requirements & Constraints
Mandatory Logging Integration
All user actions (shorten, add, remove, errors) are logged using a custom logging middleware. No use of console.log or browser logging.

Short Link Uniqueness
All generated and custom shortcodes are checked for uniqueness within the application.

Default Validity
If the validity field is blank, it defaults to 30 minutes.

Custom Shortcodes
Users may provide a preferred shortcode (must be unique), or one is generated automatically.

Client-Side Validation
All input is validated for URL format, validity as a positive integer, and shortcode uniqueness before processing.

Display Results
Original URL, shortened URL, shortcode, and expiry are shown for each entry.

Styling
Only native CSS or Material UI is used (no Tailwind, Bootstrap, ShadCN, etc.).

Error Handling
All validation and operational errors are shown as user-friendly messages.

Statistics Page
All logs are displayed on a dedicated statistics page using the logger’s getLogs() method.

Routing/Redirection
Client-side routing is handled for short URLs, redirecting users to the original URLs.
