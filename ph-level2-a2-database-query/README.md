# Vehicle Booking System SQL Queries

## Project Overview
This project contains SQL queries designed for a Vehicle Booking System database. The purpose of these queries is to extract meaningful information from the database, including bookings, vehicle availability, and customer-vehicle relationships. Each query demonstrates the use of SQL concepts such as **JOINs, EXISTS, WHERE, GROUP BY, and HAVING clauses**.

---

## Queries and Solutions

### Query 1: Retrieve booking information along with Customer name and Vehicle name
**Requirement:** Display booking details along with the customer’s name and the vehicle name.  

```sql
SELECT 
    b.booking_id, 
    u.name AS customer_name, 
    v.name AS vehicle_name, 
    b.start_date, 
    b.end_date, 
    b.status 
FROM bookings b
JOIN users u ON b.user_id = u.user_id
JOIN vehicles v ON b.vehicle_id = v.vehicle_id
ORDER BY b.booking_id;

Explanation:
This query joins the bookings, users, and vehicles tables to fetch all relevant booking information in a single result set. It ensures that each booking shows who made it and which vehicle is booked.


### Query 2: Find all vehicles that have never been booked
**Requirement:** Retrieve vehicles that do not have any associated bookings using EXISTS.

SELECT 
    v.vehicle_id, 
    v.name, 
    v.type, 
    v.model, 
    v.registration_number, 
    v.rental_price, 
    v.status 
FROM vehicles v
WHERE NOT EXISTS (
    SELECT 1 
    FROM bookings b 
    WHERE b.vehicle_id = v.vehicle_id
)
ORDER BY v.vehicle_id;

Explanation:
This query checks for vehicles with no entries in the bookings table. The NOT EXISTS clause ensures that only vehicles without bookings are returned.


### Query 3: Retrieve all available vehicles of a specific type
**Requirement:** Use the WHERE clause to find all available vehicles of type "car".

SELECT 
    vehicle_id, 
    name, 
    type, 
    model, 
    registration_number, 
    rental_price, 
    status 
FROM vehicles
WHERE type = 'car'
AND status = 'available';

Explanation:
This query filters the vehicles table to only show cars that are currently available for booking. The WHERE clause applies multiple conditions to narrow down the results.

### Query 4: Find vehicles with more than 2 bookings
**Requirement:** Use GROUP BY and HAVING to find vehicles with a high number of bookings.

SELECT 
    v.name AS vehicle_name, 
    COUNT(b.booking_id) AS total_bookings 
FROM vehicles v
JOIN bookings b ON v.vehicle_id = b.vehicle_id
GROUP BY v.name
HAVING COUNT(b.booking_id) > 2
ORDER BY total_bookings DESC;

Explanation:
This query groups bookings by vehicle and counts the total bookings for each vehicle. The HAVING clause filters the results to only include vehicles with more than 2 bookings. The results are ordered by the number of bookings in descending order.