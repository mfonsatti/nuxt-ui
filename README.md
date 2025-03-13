# Nuxt UI Project

This project is a Nuxt-based UI for managing travel bookings. It allows users to view available travels, reserve seats, and manage their cart. Below are the instructions and features of the project.

## Step 1: Setting up the Project

1. Clone the repository:
   ```bash
   git clone https://github.com/mfonsatti/nuxt-ui
   ```
2. Install the dependencies:
   ```bash
   cd nuxt-ui
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```

Once the project is up and running, you can access it at `http://localhost:3000`.
To Work properly the Laravel Backend must be up and running https://github.com/mfonsatti/weroad-api
The API communication is already set up to be toward localhost:8000

## Features

- **Available Travels**: The project will display only the available travels that have 1 or more reservations, with a maximum of 5 seats.
- **Booking Reservation**: Users can reserve a travel at the indicated price for a period of 15 minutes.
- **Cart Management**: Users can retrieve their cart operations via email.
- **Expired Reservations**: The cart will show expired reservations.
- **Available Reservations**: The cart will show reservations that can still be purchased.
- **Booking Confirmation**: Only reservations that are not already confirmed can be purchased.
- **Concurrency Handling**: When booking a single travel, the system will handle the classic example where a user reserves a seat, but before completing the payment, another user reserves and confirms all available seats for that travel.

