CREATE DATABASE IF NOT EXISTS unihub_db;

USE unihub_db;

CREATE TABLE IF NOT EXISTS users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('student', 'club_admin', 'system_admin') DEFAULT 'student',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS clubs (
    club_id INT AUTO_INCREMENT PRIMARY KEY,
    club_name VARCHAR(100) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS events (
    event_id INT AUTO_INCREMENT PRIMARY KEY,
    club_id INT,
    event_title VARCHAR(150) NOT NULL,
    event_description TEXT,
    event_date DATE,
    event_time TIME,
    location VARCHAR(150),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (club_id) REFERENCES clubs(club_id)
        ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS memberships (
    membership_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    club_id INT NOT NULL,
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
        ON DELETE CASCADE,
    FOREIGN KEY (club_id) REFERENCES clubs(club_id)
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS announcements (
    announcement_id INT AUTO_INCREMENT PRIMARY KEY,
    club_id INT,
    title VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (club_id) REFERENCES clubs(club_id)
        ON DELETE SET NULL
);

INSERT INTO clubs (club_name, description, category) VALUES
('Computer Club', 'A club for programming, technology, and innovation.', 'Technology'),
('Cultural Club', 'A club for cultural events and performances.', 'Culture'),
('Sports Club', 'A club for sports activities and competitions.', 'Sports');

INSERT INTO events (club_id, event_title, event_description, event_date, event_time, location) VALUES
(1, 'Programming Contest', 'A beginner-friendly coding contest.', '2026-07-10', '10:00:00', 'Computer Lab'),
(2, 'Cultural Fest', 'Annual cultural program.', '2026-07-15', '14:00:00', 'Auditorium'),
(3, 'Football Tournament', 'Inter-department football tournament.', '2026-07-20', '16:00:00', 'University Field');