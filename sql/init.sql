CREATE DATABASE IF NOT EXISTS spotdb
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE spotdb;

-- 축제 테이블
CREATE TABLE IF NOT EXISTS festival (
    id            BIGINT PRIMARY KEY AUTO_INCREMENT,
    name          VARCHAR(255) NOT NULL,   -- 축제명
    region        VARCHAR(100) NOT NULL,   -- 지역 (서울, 부산 등)
    address       VARCHAR(255),            -- 상세 주소
    start_date    DATE NOT NULL,           -- 시작일
    end_date      DATE NOT NULL,           -- 종료일
    lat           DOUBLE NOT NULL,         -- 위도
    lng           DOUBLE NOT NULL         -- 경도
);

-- 주차장 테이블
CREATE TABLE IF NOT EXISTS parking (
    id            BIGINT PRIMARY KEY AUTO_INCREMENT,
    name          VARCHAR(255) NOT NULL,   -- 주차장명
    address       VARCHAR(255),            -- 주소
    lat           DOUBLE NOT NULL,         -- 위도
    lng           DOUBLE NOT NULL,         -- 경도
    capacity      INT,                     -- 주차 가능 대수
    is_free       BOOLEAN DEFAULT FALSE    -- 유무료 (TRUE: 무료, FALSE: 유료)
);