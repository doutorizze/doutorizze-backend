const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');
const path = require('path');
require('dotenv').config();

// Configuração do banco SQLite
const dbPath = path.join(__dirname, '..', 'doutorizze.db');
let db;

// Inicializar conexão SQLite
const initDatabase = async () => {
  if (!db) {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database
    });
    
    // Habilitar foreign keys
    await db.exec('PRAGMA foreign_keys = ON');
    console.log('✅ Conexão com SQLite estabelecida com sucesso!');
  }
  return db;
};

// Função para testar conexão
const testConnection = async () => {
  try {
    await initDatabase();
    return true;
  } catch (error) {
    console.error('❌ Erro ao conectar com SQLite:', error.message);
    return false;
  }
};

// Função para executar queries
const query = async (sql, params = []) => {
  try {
    await initDatabase();
    
    // Converter queries MySQL para SQLite
    let sqliteQuery = sql
      .replace(/AUTO_INCREMENT/gi, 'AUTOINCREMENT')
      .replace(/ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci/gi, '')
      .replace(/CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP/gi, 'CURRENT_TIMESTAMP');
    
    if (sqliteQuery.toLowerCase().includes('select')) {
      return await db.all(sqliteQuery, params);
    } else if (sqliteQuery.toLowerCase().includes('insert')) {
      const result = await db.run(sqliteQuery, params);
      return { insertId: result.lastID, affectedRows: result.changes };
    } else {
      const result = await db.run(sqliteQuery, params);
      return { affectedRows: result.changes };
    }
  } catch (error) {
    console.error('Erro na query:', error);
    throw error;
  }
};

// Função para transações
const transaction = async (callback) => {
  await initDatabase();
  try {
    await db.exec('BEGIN TRANSACTION');
    const result = await callback(db);
    await db.exec('COMMIT');
    return result;
  } catch (error) {
    await db.exec('ROLLBACK');
    throw error;
  }
};

module.exports = {
  query,
  transaction,
  testConnection,
  initDatabase
};