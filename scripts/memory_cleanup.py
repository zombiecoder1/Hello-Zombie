#!/usr/bin/env python3
"""
ZombieCoder Memory Cleanup Script
Automatically cleans old conversation data and optimizes memory usage
"""

import os
import sqlite3
import logging
from datetime import datetime, timedelta
from pathlib import Path

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('logs/memory_cleanup.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

class ZombieCoderMemoryCleanup:
    def __init__(self, db_path="data/memory/hello_zombie_memory.sqlite"):
        self.db_path = Path(db_path)
        self.retention_days = 30  # Keep conversations for 30 days
        
    def cleanup_old_conversations(self):
        """Remove conversations older than retention period"""
        try:
            if not self.db_path.exists():
                logger.warning(f"Database not found: {self.db_path}")
                return
                
            with sqlite3.connect(self.db_path) as conn:
                cursor = conn.cursor()
                
                # Calculate cutoff date
                cutoff_date = datetime.now() - timedelta(days=self.retention_days)
                cutoff_str = cutoff_date.strftime('%Y-%m-%d %H:%M:%S')
                
                # Count old conversations
                cursor.execute(
                    "SELECT COUNT(*) FROM conversations WHERE timestamp < ?",
                    (cutoff_str,)
                )
                old_count = cursor.fetchone()[0]
                
                if old_count > 0:
                    # Delete old conversations
                    cursor.execute(
                        "DELETE FROM conversations WHERE timestamp < ?",
                        (cutoff_str,)
                    )
                    deleted = cursor.rowcount
                    
                    logger.info(f"Cleaned up {deleted} old conversations (older than {self.retention_days} days)")
                    
                    # Vacuum database to reclaim space
                    conn.execute("VACUUM")
                    logger.info("Database vacuumed to reclaim space")
                else:
                    logger.info("No old conversations to clean up")
                    
        except Exception as e:
            logger.error(f"Error during cleanup: {e}")
    
    def optimize_database(self):
        """Optimize database performance"""
        try:
            if not self.db_path.exists():
                return
                
            with sqlite3.connect(self.db_path) as conn:
                # Analyze database for optimization
                conn.execute("ANALYZE")
                
                # Get database size before optimization
                size_before = self.db_path.stat().st_size
                
                # Vacuum database
                conn.execute("VACUUM")
                
                # Get database size after optimization
                size_after = self.db_path.stat().st_size
                saved_space = size_before - size_after
                
                logger.info(f"Database optimized: saved {saved_space} bytes")
                
        except Exception as e:
            logger.error(f"Error during optimization: {e}")
    
    def get_memory_stats(self):
        """Get memory usage statistics"""
        try:
            if not self.db_path.exists():
                return {"error": "Database not found"}
                
            with sqlite3.connect(self.db_path) as conn:
                cursor = conn.cursor()
                
                # Get total conversations
                cursor.execute("SELECT COUNT(*) FROM conversations")
                total_conversations = cursor.fetchone()[0]
                
                # Get recent conversations (last 7 days)
                week_ago = (datetime.now() - timedelta(days=7)).strftime('%Y-%m-%d %H:%M:%S')
                cursor.execute(
                    "SELECT COUNT(*) FROM conversations WHERE timestamp > ?",
                    (week_ago,)
                )
                recent_conversations = cursor.fetchone()[0]
                
                # Get database size
                db_size = self.db_path.stat().st_size
                db_size_mb = db_size / (1024 * 1024)
                
                return {
                    "total_conversations": total_conversations,
                    "recent_conversations": recent_conversations,
                    "database_size_mb": round(db_size_mb, 2),
                    "retention_days": self.retention_days
                }
                
        except Exception as e:
            logger.error(f"Error getting stats: {e}")
            return {"error": str(e)}
    
    def run_cleanup(self):
        """Run complete memory cleanup"""
        logger.info("Starting ZombieCoder memory cleanup...")
        
        # Get stats before cleanup
        stats_before = self.get_memory_stats()
        logger.info(f"Before cleanup: {stats_before}")
        
        # Run cleanup
        self.cleanup_old_conversations()
        self.optimize_database()
        
        # Get stats after cleanup
        stats_after = self.get_memory_stats()
        logger.info(f"After cleanup: {stats_after}")
        
        logger.info("Memory cleanup completed successfully!")

if __name__ == "__main__":
    # Create logs directory if it doesn't exist
    Path("logs").mkdir(exist_ok=True)
    
    # Run cleanup
    cleanup = ZombieCoderMemoryCleanup()
    cleanup.run_cleanup()
