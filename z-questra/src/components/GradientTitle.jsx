import React from 'react';

/**
 * Slow gradient text — disabled via CSS when reduced motion or photophobia dataset is set.
 */
export default function GradientTitle({
  as: Tag = 'span',
  children,
  className = '',
  variant = 'platform',
  style,
}) {
  const cn = ['zq-gradient-title', `zq-gradient-title--${variant}`, className].filter(Boolean).join(' ');
  return (
    <Tag className={cn} style={style}>
      {children}
    </Tag>
  );
}
