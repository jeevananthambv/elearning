import { useState, useEffect } from 'react';
import { checkHealth } from '../api';

const SystemStatus = () => {
    const [status, setStatus] = useState('checking');
    const [message, setMessage] = useState('Checking connectivity...');
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const verifyConnection = async () => {
            try {
                const result = await checkHealth();
                if (result.success) {
                    setStatus('online');
                    setMessage('System Online');
                    // Hide after 5 seconds if successful
                    setTimeout(() => setVisible(false), 5000);
                } else {
                    setStatus('offline');
                    setMessage(result.message);
                }
            } catch (err) {
                setStatus('offline');
                setMessage('Connection Verification Failed');
            }
        };

        verifyConnection();
        // Check every 30 seconds
        const interval = setInterval(verifyConnection, 30000);
        return () => clearInterval(interval);
    }, []);

    if (!visible && status === 'online') return null;

    const styles = {
        position: 'fixed',
        bottom: '20px',
        left: '20px',
        padding: '10px 15px',
        borderRadius: '8px',
        background: status === 'online' ? 'rgba(16, 185, 129, 0.9)' : 'rgba(239, 68, 68, 0.9)',
        color: 'white',
        fontSize: '12px',
        fontWeight: 'bold',
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        backdropFilter: 'blur(4px)',
        border: '1px solid rgba(255,255,255,0.2)'
    };

    return (
        <div style={styles} title={message}>
            <span style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: 'white',
                display: 'inline-block',
                animation: status === 'checking' ? 'pulse 1s infinite' : 'none'
            }}></span>
            {status === 'checking' ? 'Checking...' : (status === 'online' ? '● System Online' : '⚠ Connection Error')}
        </div>
    );
};

export default SystemStatus;
