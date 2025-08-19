#!/usr/bin/env node

const pool = require("../server/db"); // DB 연결 모듈 경로 확인해서 맞게 수정!

async function seed() {
  try {
    await pool.query(`
      INSERT IGNORE INTO users (id, email, nickname, role, neighborhood, \`language\`)
      VALUES (1, 'seed@test.com', '시드유저', 'resident', '서울', 'ko')
    `);

    await pool.query(`
      INSERT IGNORE INTO stores (id, owner_id, name, address)
      VALUES (1, 1, '홍길동 분식', '서울 어딘가')
    `);

    await pool.query(`
      INSERT IGNORE INTO store_reviews (id, store_id, user_id, rating, content)
      VALUES
      (1, 1, 1, 5, '맛있어요!'),
      (2, 1, 1, 4, '또 올게요')
    `);

    console.log("✅ DB Seeding 완료!");
    process.exit(0);
  } catch (err) {
    console.error("Seed 실패:", err.message);
    process.exit(1);
  }
}

seed();
