CREATE DATABASE IF NOT EXISTS `sp_movies`;
USE `sp_movies`;

-- Host: localhost    Database: sp_movies
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS user;
DROP TABLE IF EXISTS genre;
DROP TABLE IF EXISTS movie;
DROP TABLE IF EXISTS movie_genres;
DROP TABLE IF EXISTS reviews;
DROP TABLE IF EXISTS screening_timeslots;

SET FOREIGN_KEY_CHECKS = 1;
--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
    `userid` INT NOT NULL AUTO_INCREMENT,
    `username` varchar(255) NOT NULL,
    `email` varchar(255) NOT NULL,
    `contact` INT NOT NULL,
    `password` varchar(255) NOT NULL,
    `type` varchar(255) NOT NULL,
    `profile_pic_url` varchar(255) NOT NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT NOW(),
    PRIMARY KEY(`userid`),
    UNIQUE(`username`)
);

--
-- Dumping data for table `user`
--
LOCK TABLES `user` WRITE;
INSERT INTO user (username, email, contact, password, type, profile_pic_url) VALUES 
('admin', 'admin@gmail.com', '84885361', '$2a$10$ynLfbOxTP1wFbqrY1VlTk.8llLJTKHp5pvDGKYQmNVGBy4L.91IKm', 'Admin', 'https://www.abc.com/admin.jpg'), 
('member', 'member@gmail.com', '93645718', '$2a$10$Fe9HWHCMpHBrGoLMSaYbCe/P3S8jKZMWgJfsZZD5j3FTkSdM.0BRK', 'Customer', 'https://www.abc.com/member.jpg'), 
('Terry Tan', 'terry@gmail.com', '91234567', '$2a$10$Fe9HWHCMpHBrGoLMSaYbCe/P3S8jKZMWgJfsZZD5j3FTkSdM.0BRK', 'Customer', 'https://www.abc.com/terry.jpg'), 
('Johnny Appleseed', 'johnny@yahoo.com', '84665371', '$2a$10$Fe9HWHCMpHBrGoLMSaYbCe/P3S8jKZMWgJfsZZD5j3FTkSdM.0BRK', 'Customer', 'https://www.def.com/johnny.jpg'), 
('Eula Lawrence', 'eula@yahoo.com', '85387752', '$2a$10$Fe9HWHCMpHBrGoLMSaYbCe/P3S8jKZMWgJfsZZD5j3FTkSdM.0BRK', 'Customer', 'https://www.ghi.com/eula.jpg'), 
('Kaeya Alberich', 'kaeya@gmail.com', '94367178', '$2a$10$Fe9HWHCMpHBrGoLMSaYbCe/P3S8jKZMWgJfsZZD5j3FTkSdM.0BRK', 'Customer', 'https://www.jkl.com/kaeya.jpg'), 
('Diluc Ragvindr', 'diluc@yahoo.com', '98356791', '$2a$10$Fe9HWHCMpHBrGoLMSaYbCe/P3S8jKZMWgJfsZZD5j3FTkSdM.0BRK', 'Customer', 'https://www.mno.com/diluc.jpg');
UNLOCK TABLES;

--
-- user id alias from user table
--
SELECT userid INTO @terry_id FROM user WHERE username = 'Terry Tan' LIMIT 1;
SELECT userid INTO @johnny_id FROM user WHERE username = 'Johnny Appleseed' LIMIT 1;
SELECT userid INTO @eula_id FROM user WHERE username = 'Eula Lawrence' LIMIT 1;
SELECT userid INTO @kaeya_id FROM user WHERE username = 'Kaeya Alberich' LIMIT 1;
SELECT userid INTO @diluc_id FROM user WHERE username = 'Diluc Ragvindr' LIMIT 1;

--
-- Table structure for table `genre`
--

DROP TABLE IF EXISTS `genre`;
CREATE TABLE `genre` (
    `genreid` INT NOT NULL AUTO_INCREMENT,
    `genre` varchar(255) NOT NULL,
    `description` varchar(255) NOT NULL,
    PRIMARY KEY(`genreid`),
    UNIQUE(`genre`)
);

--
-- Dumping data for table `genre`
--
LOCK TABLES `genre` WRITE;
INSERT INTO genre (genre, description) VALUES 
('Action','the action genre has close ties to classic strife and struggle narratives that you find across all manner of art and literature'), 
('Horror','the horror genre is told to deliberately scare or frighten the audience, through suspense, violence or shock'), 
('Thriller','the thriller genre is a story that is usually a mix of fear and excitement. It has traits from the suspense genre and often from the action, adventure or mystery genres'), 
('Mystery','the mystery genre is a genre of literature whose stories focus on a puzzling crime, situation, or circumstance that needs to be solved'), 
('Romance','the romance genre is understood to be "love stories," emotion-driven stories that are primarily focused on the relationship between the main characters of the story '), 
('Comedy','the comedy genre usually tells stories about a series of funny, or comical events, intended to make the audience laugh.');
UNLOCK TABLES;

--
-- genreID Alias from genre table
--
SELECT genreid INTO @action_genreid FROM genre WHERE genre = 'Action' LIMIT 1;
SELECT genreid INTO @horror_genreid FROM genre WHERE genre = 'Horror' LIMIT 1;
SELECT genreid INTO @thriller_genreid FROM genre WHERE genre = 'Thriller' LIMIT 1;
SELECT genreid INTO @mystery_genreid FROM genre WHERE genre = 'Mystery' LIMIT 1;
SELECT genreid INTO @romance_genreid FROM genre WHERE genre = 'Romance' LIMIT 1;
SELECT genreid INTO @comedy_genreid FROM genre WHERE genre = 'Comedy' LIMIT 1;

--
-- Table structure for table `movie`
--

DROP TABLE IF EXISTS `movie`;
CREATE TABLE `movie` (
    `movieid` INT NOT NULL AUTO_INCREMENT,
    `title` varchar(255) NOT NULL,
    `description` text NOT NULL,
    `cast` varchar(255) NOT NULL,
    `time` varchar(255) NOT NULL,
    `opening_date` varchar(255) NOT NULL,
    `poster_filename` varchar(255),
    PRIMARY KEY(`movieid`),
    UNIQUE( `title`)
);

--
-- Dumping data for table `movie`
--
LOCK TABLES `movie` WRITE;
INSERT INTO movie (title, description, cast, time, opening_date, poster_filename) VALUES 
('Godzilla vs. Kong', 'Legends collide as Godzilla and Kong, the two most powerful forces of nature, clash on the big screen in a spectacular battle for the ages. As a squadron embarks on a perilous mission into fantastic uncharted terrain, unearthing clues to the Titans'' very origins and mankind''s survival, a conspiracy threatens to wipe the creatures, both good and bad, from the face of the earth forever.','Shun Oguri, Rebecca Hall, Kyle Chandler, Millie Bobby Brown, Brian Tyree Henry, Alexander Skarsgard , Eiza González, Julian Dennison, Demián Bichir','113 mins','24 Mar 2021','moviePoster_1625399576647.jpg'), 
('A Quiet Place II','Following the deadly events at home, the Abbott family must now face the terrors of the outside world as they continue their fight for survival in silence. Forced to venture into the unknown, they quickly realize that the creatures that hunt by sound are not the only threats that lurk beyond the sand path.', 'Emily Blunt, John Krasinski, Millicent Simmonds, Noah Jupe, Cillian Murphy, Djimon Hounsou, Zachary Golinger, Okieriete Onaodowan, Scoot McNairy', '97mins', '10 Jun 2021', 'moviePoster_1625399600610.jpg'), 
('Black Widow', 'Following the events of Captain America: Civil War, Natasha Romanoff finds herself on the run and forced to confront a dangerous conspiracy with ties to her past. Pursued by a force that will stop at nothing to bring her down, Romanoff must deal with her history as a spy and the broken relationships left in her wake long before she became an Avenger.', ' Scarlett Johansson, Florence Pugh, Robert Downey, Jr., David Harbour, O-T Fagbenle, Rachel Weisz, William Hurt, Ray Winstone', '134mins', '8 Jul 2021', 'moviePoster_1625399611822.jpg'), 
('We Made A Beautiful Bouquet', 'Is it really better to have loved and lost, than never to have loved at all? Mugi and Kinu meet by chance one night, after missing the last train. They believe that they have found the ideal partner in each other through shared interests in music, movies and books, but the relationship eventually turns sour when reality gets in the way.', 'Masaki Suda, Kasumi Arimura, Joe Odagiri, Keiko Toda, Ryô Iwamatsu, Kanata Hosoda, Kaya Kiyohara, Kaoru Kobayashi', '124mins', '17 Jun 2021', 'moviePoster_1625399641243.jpg'), 
('Tom & Jerry', 'A legendary rivalry reemerges when Jerry moves into New York City''s finest hotel on the eve of the wedding of the century, forcing the desperate event planner to hire Tom to get rid of him. As mayhem ensues, the escalating cat-and-mouse battle soon threatens to destroy her career, the wedding, and possibly the hotel itself.', 'Chloë Grace Moretz, Michael Peña, Colin Jost, Rob Delaney, Pallavi Sharda, Jordan Bolger, Patsy Ferran, Ken Jeong', '101mins', '10 Feb 2021', 'moviePoster_1625399659539.jpg'), 
('The Conjuring: The Devil Made Me Do It', 'Paranormal investigators Ed and Lorraine Warren take on one of the most sensational cases of their careers after a cop stumbles upon a dazed and bloodied young man walking down the road. Accused of murder, the suspect claims demonic possession as his defense, forcing the Warrens into a supernatural inquiry unlike anything they''ve ever seen before.', 'Patrick Wilson, Vera Farmiga, Ruairi O''Connor, Sarah Catherine Hook, Julian Hilliard', '112mins', '11 Jun 2021', 'moviePoster_1625399683320.jpg');
UNLOCK TABLES;

--
-- movieID Alias from movie table
--
SELECT movieid INTO @godzilla_movieid FROM movie WHERE title = 'Godzilla vs. Kong' LIMIT 1;
SELECT movieid INTO @quietplace_movieid FROM movie WHERE title = 'A Quiet Place II' LIMIT 1;
SELECT movieid INTO @blackwidow_movieid FROM movie WHERE title = 'Black Widow' LIMIT 1;
SELECT movieid INTO @beautifulbouquet_movieid FROM movie WHERE title = 'We Made A Beautiful Bouquet' LIMIT 1;
SELECT movieid INTO @tomnjerry_movieid FROM movie WHERE title = 'Tom & Jerry' LIMIT 1;
SELECT movieid INTO @conjuring_movieid FROM movie WHERE title = 'The Conjuring: The Devil Made Me Do It' LIMIT 1;

--
-- Table structure for table `movie_genres`
--

DROP TABLE IF EXISTS `movie_genres`;
CREATE TABLE `movie_genres` (
	`id` INT NOT NULL AUTO_INCREMENT,
    `movieid` INT NOT NULL,
    `genreid` INT NOT NULL,
    PRIMARY KEY(`id`),
    FOREIGN KEY(`movieid`) REFERENCES movie(`movieid`) ON DELETE CASCADE,
    FOREIGN KEY(`genreid`) REFERENCES genre(`genreid`) ON DELETE CASCADE
);

--
-- Dumping data for table `movie_genres`
--
LOCK TABLES `movie_genres` WRITE;
INSERT INTO movie_genres (movieid, genreid) VALUES 
(@godzilla_movieid, @action_genreid), (@godzilla_movieid, @thriller_genreid), 
(@quietplace_movieid, @horror_genreid), (@quietplace_movieid, @thriller_genreid), (@quietplace_movieid, @mystery_genreid), 
(@blackwidow_movieid, @action_genreid), (@blackwidow_movieid, @thriller_genreid), (@beautifulbouquet_movieid, @romance_genreid), 
(@tomnjerry_movieid, @comedy_genreid), 
(@conjuring_movieid, @horror_genreid), (@conjuring_movieid, @thriller_genreid), (@conjuring_movieid, @mystery_genreid);
UNLOCK TABLES;

--
-- Table structure for table `reviews`
--

DROP TABLE IF EXISTS `reviews`;
CREATE TABLE `reviews` (
    `reviewid` INT NOT NULL AUTO_INCREMENT,
    `movieid` INT NOT NULL,
    `userid`INT NOT NULL,
    `rating` INT NOT NULL,
    `review` varchar(255) NOT NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT NOW(),
    PRIMARY KEY(`reviewid`),
    FOREIGN KEY(`movieid`) REFERENCES movie(`movieid`) ON DELETE CASCADE,
    FOREIGN KEY(`userid`) REFERENCES user(`userid`) ON DELETE CASCADE
);

--
-- Dumping data for table `reviews`
--
LOCK TABLES `reviews` WRITE;
INSERT INTO reviews (movieid, userid, rating, review) VALUES 
(@godzilla_movieid, @terry_id, '5', 'Good Movie, love the action'), 
(@godzilla_movieid, @johnny_id, '4', 'A skyscraper-trashing brawl in neon-lit Hong Kong is the action highlight, and a late appearance from another of Godzilla''s old adversaries is sure to have fans roaring with delight.'), 
(@godzilla_movieid, @kaeya_id, '3', 'It sprints through plot and dialogue like it''s offended at the suggestion it needs them, and throws only the most basic of foundations together.'),
(@quietplace_movieid, @johnny_id, '3', 'While it''s not as fresh or surprising as the original, A Quiet Place Part II adeptly balances the demands of both the genre movie and the emotional impact of the family drama.'), 
(@quietplace_movieid, @diluc_id, '4', 'Krasinski''s instincts are very good, and once you''ve placed the primary action there...then it allows the story to move forward, maintain and even build on the tension of the original.'),
(@blackwidow_movieid, @johnny_id, '5', 'It''s not easy to take a character with no future and give them a past that makes them even more interesting.'), 
(@blackwidow_movieid, @eula_id, '4', 'A satisfying mix of muscle and emotion.'),
(@beautifulbouquet_movieid, @terry_id, '3.5', 'The movie may seem long with a runtime of 124 minutes, but We Made A Beautiful Bouquet is not an overly artistic film that can definitely be enjoyed by many young adults.'), 
(@beautifulbouquet_movieid, @kaeya_id, '4', 'Wow! This is far better than i expected. I can feel changes of Mugi and Kinu as they grew.'),
(@tomnjerry_movieid, @terry_id, '3', 'Not terrible, but nothing like the vintage...It''s okay, but the times when it works is when it has characters hitting each other with very heavy objects. Outside of that, it''s just ok...'), 
(@tomnjerry_movieid, @eula_id, '2', 'Very young kids might find some enjoyment in the brightly hued, fast-paced mania of it all, but those with any real affection for the pair of violently opposed animals will leave unimpressed.'),
(@conjuring_movieid, @kaeya_id, '4', 'The biographical nuts and bolts are intriguing and, as ever, the jump scares and murk are professionally timed and delivered.'), 
(@conjuring_movieid, @diluc_id, '4', '"The Conjuring: The Devil Made Me Do It" adds a little twist just to keep things fresh, telling a supernatural tale with the methodical approach of a police procedural.'), 
(@conjuring_movieid, @eula_id, '2', 'The franchise descends deeper into the bowels of silliness.');
UNLOCK TABLES;

--
-- Table structure for table `screening_timeslots`
--

DROP TABLE IF EXISTS `screening_timeslots`;
CREATE TABLE `screening_timeslots` (
	`id` INT NOT NULL AUTO_INCREMENT,
    `movieid` INT NOT NULL,
    `timeslot` DATETIME NOT NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT NOW(),
    PRIMARY KEY(`id`),
    FOREIGN KEY(`movieid`) REFERENCES movie(`movieid`) ON DELETE CASCADE
);

--
-- Dumping data for table `screening_timeslots`
--
LOCK TABLES `screening_timeslots` WRITE;
INSERT INTO screening_timeslots (movieid, timeslot) VALUES 
(@godzilla_movieid, '2021-07-19 18:00'), (@godzilla_movieid, '2021-07-19 20:45'), (@godzilla_movieid, '2021-07-22 11:45'), (@godzilla_movieid, '2021-07-25 12:15'), (@godzilla_movieid, '2021-07-26 14:15'),
(@quietplace_movieid, '2021-07-20 10:15'), (@quietplace_movieid, '2021-07-20 15:05'), (@quietplace_movieid, '2021-07-21 12:00'), (@quietplace_movieid, '2021-07-22 14:15'), (@quietplace_movieid, '2021-07-23 18:45'),
(@blackwidow_movieid, '2021-07-15 14:30'), (@blackwidow_movieid, '2021-07-15 19:15'), (@blackwidow_movieid, '2021-07-16 12:45'), (@blackwidow_movieid, '2021-07-16 20:00'), (@blackwidow_movieid, '2021-07-17 16:45'),
(@beautifulbouquet_movieid, '2021-07-21 12:15'), (@beautifulbouquet_movieid, '2021-07-22 14:15'), (@beautifulbouquet_movieid, '2021-07-22 18:30'), (@beautifulbouquet_movieid, '2021-07-23 20:45'), (@beautifulbouquet_movieid, '2021-07-24 12:00'),
(@tomnjerry_movieid, '2021-07-11 14:15'), (@tomnjerry_movieid, '2021-07-11 15:45'), (@tomnjerry_movieid, '2021-07-12 16:45'), (@tomnjerry_movieid, '2021-07-13 19:45'), (@tomnjerry_movieid, '2021-07-14 14:15'),
(@conjuring_movieid, '2021-07-23 22:45'), (@conjuring_movieid, '2021-07-24 16:45'), (@conjuring_movieid, '2021-07-24 19:15'), (@conjuring_movieid, '2021-07-25 13:15'), (@conjuring_movieid, '2021-07-25 20:00');
UNLOCK TABLES;