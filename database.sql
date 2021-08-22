USE master
GO

DROP DATABASE IF EXISTS lato2021magazyn
GO

CREATE DATABASE lato2021magazyn
GO

USE lato2021magazyn
GO

CREATE USER app FOR LOGIN app
GO

EXEC sp_addrolemember 'db_datawriter', 'app'
EXEC sp_addrolemember 'db_datareader', 'app'

CREATE TABLE Produkty (
    Id INT PRIMARY KEY,
    Nazwa VARCHAR(50) NOT NULL,
    Kategoria VARCHAR(50) NOT NULL CHECK (Kategoria IN ('Sport', 'Zabawki', 'Ubrania')),
    Ilosc SMALLINT NOT NULL CHECK (Ilosc > 0),
    Cena MONEY NOT NULL CHECK (Cena > 0)
)

INSERT INTO Produkty VALUES
(1, 'Rower', 'Sport', 10, 1000),
(2, 'Pluszowy miś', 'Zabawki', 40, 50),
(3, 'Koń na biegunach', 'Zabawki', 2, 200),
(4, 'Spodnie', 'Ubrania', 16, 99.99),
(5, 'Sandały', 'Ubrania', 21, 78.55),
(6, 'Rakieta tenisowa', 'Sport', 3, 250)
