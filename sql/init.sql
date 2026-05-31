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
