import React from "react";

interface FooterProps {
    companyName: string;
}

const Footer: React.FC<FooterProps> = ({ companyName }: FooterProps) => {
    return (
        <footer style={styles.footer}>
            <p>&copy; {new Date().getFullYear()} {companyName}. All rights reserved.</p>
        </footer>
    );
}

const styles = {
    footer: {
        backgroundColor: '#f8f9fa',
        padding: '0.5rem',
        textAlign: 'center' as const,
        borderTop: '1px solid #e7e7e7',
    },
};

export default Footer;