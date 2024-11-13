INSERT INTO users (username, password, profile_img) VALUES
('jessika25', 'password123','/user1img.jpg');

INSERT INTO items (item_id, name, item_img, price, category) VALUES
(1, 'Nordstrom Rack Tuxedo Jacket', '/tuxedo.png', 149.99, 'formal');

INSERT INTO wishlist (id_user, id_item) VALUES
(1,1);

-- Queries for API routes: 
    -- Get user info for login authentication with username $1: "SELECT * FROM users WHERE username = $1;"
    -- Create new user for register with username $1, password $2: "INSERT INTO users (username, password) VALUES ($1,$2);"
    -- Add profile pic on profile page with image url $1, user id $2: "UPDATE users SET profile_img = $1 WHERE user_id = $2;"