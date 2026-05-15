-- Local MariaDB schema for ReactProject backend
-- Usage:
--   mysql -h 127.0.0.1 -P 3306 -u portfolio_app -pportfolio1234 < backend/src/main/resources/sql/local-schema.sql

CREATE DATABASE IF NOT EXISTS portfolio
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE portfolio;

CREATE TABLE IF NOT EXISTS tb_user (
  user_id VARCHAR(36) NOT NULL,
  user_name VARCHAR(100) NOT NULL,
  password VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'USER',
  status VARCHAR(20) NOT NULL DEFAULT 'Active',
  last_login DATETIME NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id),
  UNIQUE KEY uk_tb_user_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS tb_product (
  prod_id INT NOT NULL AUTO_INCREMENT,
  prod_name VARCHAR(255) NOT NULL,
  prod_price INT NOT NULL,
  prod_stock INT NOT NULL DEFAULT 0,
  prod_category VARCHAR(100) NOT NULL,
  prod_desc TEXT NULL,
  prod_img VARCHAR(255) NULL,
  prod_status VARCHAR(30) NOT NULL DEFAULT 'ON_SALE',
  reg_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (prod_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS tb_cart (
  cart_id INT NOT NULL AUTO_INCREMENT,
  user_id VARCHAR(36) NOT NULL,
  prod_id INT NOT NULL,
  quantity INT NOT NULL,
  PRIMARY KEY (cart_id),
  UNIQUE KEY uk_tb_cart_user_prod (user_id, prod_id),
  CONSTRAINT fk_tb_cart_user
    FOREIGN KEY (user_id) REFERENCES tb_user (user_id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_tb_cart_product
    FOREIGN KEY (prod_id) REFERENCES tb_product (prod_id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS tb_order (
  order_id INT NOT NULL AUTO_INCREMENT,
  user_id VARCHAR(36) NOT NULL,
  order_no VARCHAR(50) NOT NULL,
  total_amount INT NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'PAID',
  order_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (order_id),
  UNIQUE KEY uk_tb_order_order_no (order_no),
  KEY idx_tb_order_status_date (status, order_date),
  CONSTRAINT fk_tb_order_user
    FOREIGN KEY (user_id) REFERENCES tb_user (user_id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS tb_order_detail (
  detail_id INT NOT NULL AUTO_INCREMENT,
  order_id INT NOT NULL,
  prod_id INT NOT NULL,
  price INT NOT NULL,
  quantity INT NOT NULL,
  PRIMARY KEY (detail_id),
  KEY idx_tb_order_detail_order_id (order_id),
  KEY idx_tb_order_detail_prod_id (prod_id),
  CONSTRAINT fk_tb_order_detail_order
    FOREIGN KEY (order_id) REFERENCES tb_order (order_id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_tb_order_detail_product
    FOREIGN KEY (prod_id) REFERENCES tb_product (prod_id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS tb_recruit (
  recruit_id INT NOT NULL AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  contents LONGTEXT NOT NULL,
  status VARCHAR(30) NOT NULL,
  start_date DATETIME NULL,
  end_date DATETIME NULL,
  reg_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (recruit_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS tb_devlog (
  log_id INT NOT NULL AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  content LONGTEXT NOT NULL,
  type VARCHAR(30) NOT NULL,
  reg_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (log_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Optional: make a registered user admin after signup
-- UPDATE tb_user SET role = 'Admin' WHERE email = 'your_email@example.com';
