import React from 'react';

interface Props<T extends React.CSSProperties> {
  children: React.ReactNode;
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
  style?: T;
}

const Button = <T extends React.CSSProperties,>({ children, style, onClick }: Props<T>) => {
  return (
    <button style={style} onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;
