'use client';

import { SwishSpinner } from 'react-spinners-kit';

export default function Loading() {
  // You can add any UI inside Loading, including a Skeleton.
  return (
    <div className='h-full w-full flex justify-center items-center'>
      <SwishSpinner />
    </div>
  );
}
