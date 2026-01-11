create table users (
  user_id serial primary key,
  name varchar(30) not null,
  email varchar(50) unique not null,
  password varchar(50) not null,
  phone varchar(15),
  role varchar(20) not null check (role in ('Customer', 'Admin'))
);

-- insert data into users table 
insert into users (name, email, password, phone, role) values
  ('Alice', 'alice@example.com', 'pass123456', '1234567890', 'Customer'),
  ('Bob', 'bob@example.com', 'pass123456', '0987654321', 'Admin'),
  ('Charlie', 'charlie@example.com', 'pass123456', '1122334455', 'Customer');



create table vehicles (
  vehicle_id serial primary key,
  name varchar(50) not null,
  type varchar(15) not null check (type in ('car', 'bike', 'truck')),
  model int,
  registration_number varchar(30) unique not null,
  rental_price numeric(8, 2) not null,
  status varchar(15) not null check (status in ('available', 'rented', 'maintenance'))
);

-- insert data into vehicles table 
insert into vehicles (name, type, model, registration_number, rental_price, status) values
  ('Toyota Corolla', 'car', 2022, 'ABC-123', 50, 'available'),
  ('Honda Civic', 'car', 2021, 'DEF-456', 60, 'rented'),
  ('Yamaha R15', 'bike', 2023, 'GHI-789', 30, 'available'),
  ('Ford F-150', 'truck', 2020, 'JKL-012', 100, 'maintenance');

create table bookings (
  booking_id serial primary key,
  user_id int references users(user_id) on delete cascade,
  vehicle_id int references vehicles(vehicle_id) on delete cascade,
  start_date DATE not null,
  end_date DATE not null,
  status varchar(20) not null check (status in ('pending', 'confirmed', 'completed', 'cancelled')),
  total_cost numeric(8,2) not null,
  -- Table-level constraint
  check (end_date >= start_date)
);

-- insert data into bookings table
insert into bookings (user_id, vehicle_id, start_date, end_date, status, total_cost) values
  (1, 2, '2023-10-01', '2023-10-05', 'completed', 240),
  (1, 2, '2023-11-01', '2023-11-03', 'completed', 120),
  (3, 2, '2023-12-01', '2023-12-02', 'confirmed', 60),
  (1, 1, '2023-12-10', '2023-12-12', 'pending', 100);

-- Query 1. Requirement: Retrieve booking information along with Customer name and Vehicle name.
select b.booking_id, u.name as customer_name, 
  v.name as vehicle_name, b.start_date, b.end_date, b.status from bookings b
  join users u on b.user_id = u.user_id
  join vehicles v on b.vehicle_id = v.vehicle_id
  order by b.booking_id;

-- Query 2: EXISTS Requirement: 
-- Find all vehicles that have never been booked.
select v.vehicle_id, v.name, v.type, v.model, v.registration_number, v.rental_price, v.status from vehicles v
where not exists (
  select 1 from bookings b 
  where b.vehicle_id = v.vehicle_id
)
order by v.vehicle_id;


-- Query 3: WHERE Requirement: 
-- Retrieve all available vehicles of a specific type (e.g. cars).
select vehicle_id, name, type, model, registration_number, rental_price, status from vehicles
  where type = 'car'
  and status = 'available';

-- Query 4: GROUP BY and HAVING Requirement: 
-- Find the total number of bookings for each vehicle and display only those vehicles that have more than 2 bookings.
select v.name as vehicle_name, count(b.booking_id) as total_bookings from vehicles v
  join bookings b on v.vehicle_id = b.vehicle_id
  group by v.name 
  having count(b.booking_id) > 2
  order by total_bookings desc;