CREATE TABLE IF NOT EXISTS users (
<<<<<<< HEAD
    username VARCHAR(100) PRIMARY KEY,
=======
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
>>>>>>> a73e178 (Updated test folder)
    password CHAR(100) NOT NULL,
    profile_img VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS items (
    item_id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    item_img VARCHAR(100),
    color VARCHAR(100),
    price FLOAT,
    formality VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS wishlist (
    id_user INT NOT NULL,
    id_item INT NOT NULL
);