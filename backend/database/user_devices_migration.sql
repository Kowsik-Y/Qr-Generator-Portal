-- Create user_devices table to track logged-in devices
CREATE TABLE IF NOT EXISTS user_devices (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  device_name VARCHAR(255),
  device_type VARCHAR(50), -- 'mobile', 'desktop', 'tablet', 'unknown'
  browser VARCHAR(100),
  os VARCHAR(100),
  ip_address VARCHAR(45),
  user_agent TEXT,
  last_active TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, device_name, user_agent)
);

-- Create indexes for performance
CREATE INDEX idx_user_devices_user_id ON user_devices(user_id);
CREATE INDEX idx_user_devices_last_active ON user_devices(last_active);

-- Add system setting for max devices per user
INSERT INTO system_settings (key, value, description, category, created_at, updated_at)
VALUES 
  ('max_devices_per_user', '3', 'Maximum number of devices a user can be logged in from simultaneously', 'security', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (key) DO NOTHING;

-- Insert some sample device data for testing
INSERT INTO user_devices (user_id, device_name, device_type, browser, os, ip_address, user_agent, last_active) VALUES
(1, 'iPhone 13', 'mobile', 'Safari', 'iOS 16', '192.168.1.100', 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X)', NOW() - INTERVAL '5 minutes'),
(1, 'MacBook Pro', 'desktop', 'Chrome', 'macOS', '192.168.1.101', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)', NOW() - INTERVAL '1 hour'),
(2, 'Windows PC', 'desktop', 'Edge', 'Windows 11', '192.168.1.102', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', NOW() - INTERVAL '2 hours'),
(2, 'Android Phone', 'mobile', 'Chrome', 'Android 13', '192.168.1.103', 'Mozilla/5.0 (Linux; Android 13)', NOW() - INTERVAL '30 minutes');

COMMENT ON TABLE user_devices IS 'Tracks user login devices and sessions';
COMMENT ON COLUMN user_devices.device_name IS 'Friendly name for the device (e.g., iPhone 13, MacBook Pro)';
COMMENT ON COLUMN user_devices.device_type IS 'Type of device: mobile, desktop, tablet, unknown';
COMMENT ON COLUMN user_devices.last_active IS 'Last activity timestamp for this device';
