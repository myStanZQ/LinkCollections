import fs from 'fs'
import path from 'path'
import { app } from 'electron'

const DATA_DIR = path.join(app.getPath('userData'), 'data')

export function ensureDataDir(): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true })
  }
}

export function getDataPath(filename: string): string {
  return path.join(DATA_DIR, filename)
}

export function readJsonFile<T>(filename: string, defaultValue: T): T {
  ensureDataDir()
  const filePath = getDataPath(filename)

  try {
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8')
      return JSON.parse(content) as T
    }
  } catch (error) {
    console.error(`Error reading ${filename}:`, error)
  }

  return defaultValue
}

export function writeJsonFile<T>(filename: string, data: T): boolean {
  ensureDataDir()
  const filePath = getDataPath(filename)

  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8')
    return true
  } catch (error) {
    console.error(`Error writing ${filename}:`, error)
    return false
  }
}
