interface ButtonTextStyles {
    fontSize: string;
    color: string;
    backgroundColor: string;
    padding: { x: number; y: number; };
    fontFamily: string;
    align: string;
}

export const buttonStyle: ButtonTextStyles = {
    fontSize: '32px',
    color: '#ffdd00', // Yellow for buttons
    backgroundColor: '#005080', // Darker blue
    padding: { x: 20, y: 10 },
    fontFamily: 'Arial',
    align: 'center'
};

export const buttonHoverStyle: Partial<ButtonTextStyles> = { // Partial because not all properties are required
    color: '#ffffff',
    backgroundColor: '#0070a0' // Lighter blue on hover
};

export const buttonPressedStyle: Partial<ButtonTextStyles> = {
    color: '#cccccc',
    backgroundColor: '#003060' // Even darker blue on press
};