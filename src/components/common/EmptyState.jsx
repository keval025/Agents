import React from 'react';
import { Link } from 'react-router-dom';
import Button from './Button';

export default function EmptyState({
  icon: Icon,
  title,
  description,
  actionText,
  actionLink = '/shop',
  onActionClick,
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-4 max-w-md mx-auto">
      {Icon && (
        <div className="w-16 h-16 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-400 mb-6 border border-zinc-200">
          <Icon className="w-8 h-8 stroke-[1.5]" />
        </div>
      )}
      <h3 className="text-xl font-serif font-medium text-zinc-900 mb-2">{title}</h3>
      <p className="text-sm text-zinc-500 leading-relaxed mb-8">{description}</p>
      {actionText && (
        actionLink ? (
          <Link to={actionLink}>
            <Button variant="primary" size="md">{actionText}</Button>
          </Link>
        ) : (
          <Button onClick={onActionClick} variant="primary" size="md">{actionText}</Button>
        )
      )}
    </div>
  );
}
