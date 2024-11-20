CREATE TABLE IF NOT EXISTS users (
    username VARCHAR(100) PRIMARY KEY,
    password VARCHAR(500) NOT NULL,
    profile_img VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS items (
    item_id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    item_img VARCHAR(100),
    price FLOAT,
    category VARCHAR(100),
    description VARCHAR(2000)
);

CREATE TABLE IF NOT EXISTS wishlist (
    id_user INT NOT NULL,
    id_item INT NOT NULL
);
