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
    username VARCHAR(100) NOT NULL,
    item_id INT NOT NULL,
    FOREIGN KEY (username) REFERENCES users(username) ON DELETE CASCADE,
    FOREIGN KEY (item_id) REFERENCES items(item_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS outfits (
    outfit_id SERIAL PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    item_id_1 INT NOT NULL,
    item_id_2 INT,
    item_id_3 INT,
    item_id_4 INT,
    FOREIGN KEY (username) REFERENCES users(username) ON DELETE CASCADE,
    FOREIGN KEY (item_id_1) REFERENCES items(item_id) ON DELETE CASCADE,
    FOREIGN KEY (item_id_2) REFERENCES items(item_id) ON DELETE CASCADE,
    FOREIGN KEY (item_id_3) REFERENCES items(item_id) ON DELETE CASCADE,
    FOREIGN KEY (item_id_4) REFERENCES items(item_id) ON DELETE CASCADE
);