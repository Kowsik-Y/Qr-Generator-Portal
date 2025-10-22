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


COMMENT ON TABLE user_devices IS 'Tracks user login devices and sessions';
COMMENT ON COLUMN user_devices.device_name IS 'Friendly name for the device (e.g., iPhone 13, MacBook Pro)';
COMMENT ON COLUMN user_devices.device_type IS 'Type of device: mobile, desktop, tablet, unknown';
COMMENT ON COLUMN user_devices.last_active IS 'Last activity timestamp for this device';
