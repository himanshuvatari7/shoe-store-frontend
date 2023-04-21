import React from 'react'
import Link from 'next/link'
import Image from 'next/image'

import { getDiscountedPricePercentage } from '@/utils/helper'

const ProductCard = ({data: {attributes: p, id}}) => {
  return (
    <Link 
      href={`/product/${p.slug}`} 
      className='transform overflow-hidden bg-white duration-500 cursor-pointer hover:scale-105'
    >

        <Image 
          height={500}
          width={500}
          src={p.thumbnail.data.attributes.url}
          alt={p.name}
        />
        {/* <img src='/product-1.webp' alt="product image" className='w-full'/> */}
        <div className='p-4 text-black/[0.9]'>
            <h1 className='text-lg font-medium'>{p.name}</h1>

            <div className='flex items-center text-black/[0.5]'>
                <p className='mr-2 text-lg font-semibold'>&#8377;{p.price}</p>

                {p.original_price && (
                  <>
                    <p className='text-base font-medium line-through'>&#8377;{p.original_price}</p>
                    
                    <p className='ml-auto text-base font-medium text-green-500'>
                      {getDiscountedPricePercentage(p.original_price, p.price)}% off
                    </p>
                  
                  </>
                )}


                
            </div>

        </div>
    </Link>
  )
}

export default ProductCard