import React, { useState } from 'react'

import Wrapper from '@/components/Wrapper'
import { IoMdHeartEmpty } from 'react-icons/io'
import ProductDetailsCarousel from '@/components/ProductDetailsCarousel'
import RelatedProducts from '@/components/RelatedProducts'

import { fetchDataFromApi } from '@/utils/api'
import { getDiscountedPricePercentage } from '@/utils/helper'

import { ReactMarkdown } from 'react-markdown/lib/react-markdown'
//for showing the bullet points\


import { useSelector, useDispatch } from 'react-redux'
//for React Redux
import { addToCart } from '@/store/cartSlice'

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
//React toastify 
 
const ProductDetails = ({product, products}) => {

    const p = product?.data[0]?.attributes;

    const [selectedSize, setSelectedSize] = useState();
    const [showError, setShowError] = useState(false);

    const dispatch = useDispatch()

    const notify = () => {
        toast.success('Success. Check your cart', {
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
        });
    }

    return (
    <div className='w-full md:py-20'>
        <ToastContainer/>
        <Wrapper>

        <div className='flex flex-col lg:flex-row md:px-10 gap-[50px] lg:gap-[100px]'>
            
            {/* left col start */}
            <div className='w-full md:w-auto flex-[1.5] max-w-[500px] lg:max-w-full mx-auto lg:mx-0'>
                <ProductDetailsCarousel images={p.image.data}/>

            </div>
            {/* left col end */}



            {/* right col start */}
            <div className='flex-[1] py-3'>
                
                {/* Product title */}
                <div className='text-[34px] font-semibold mb-2 leading-tight'>
                    {p.name}
                </div>

                {/* Product subtitle */}
                <div className='text-lg font-semibold mb-5'>
                    {p.subtitle}
                </div>

                {/* Product Price */}
                <div className='flex items-center'>
                    <p className='mr-2 text-lg font-semibold'>
                        MRP : &#8377;{p.price}
                    </p>
                    {p.original_price && (
                        <>
                            <p className='text-base font-medium line-through'>
                                &#8377;{p.original_price}
                            </p>
                            <p className='ml-auto text-base font-medium text-green-500'>
                                {getDiscountedPricePercentage(
                                    p.original_price,
                                    p.price
                                )}
                                %off
                            </p>
                        </>
                    )}
                </div>

                <div className='text-sm font-medium text-black/[0.5]'>
                    incl. of all taxes
                </div>

                <div className='text-sm font-medium text-black/[0.5] mb-20'>
                    {`(Also includes all applicable duties)`}
                </div>




                {/* PRODUCT PRICE RANGE START  */}
                <div className='mb-10'>
                    {/* HEADING START  */}
                    <div className='flex justify-between mb-2'>
                        <div className='text-md font-semibold'>
                            Select Size
                        </div>
                        <div className='text-md font-medium cursor-pointer text-black/[0.5]'>
                            Select Guide
                        </div>
                    </div>
                    {/* HEADING END */}


                    {/* SIZE START */}
                    <div id="sizesGrid" className='grid grid-cols-3 gap-2'>

                        {p.size.data.map((item, i) => (
                            <div key={i} className={`border rounded-md text-center py-3
                            font-medium ${item.enabled ? 'cursor-pointer hover:border-black' : 'cursor-not-pointer bg-black/[0.1] opacity-50'} 
                            ${selectedSize === item.size ? 'border-black' : '' }`}
                            onClick={() => {
                                setSelectedSize(item.size);
                                setShowError(false);
                            }}
                            >
                                {item.size}
                            </div>
                        ))}
                    </div>
                    {/* SIZE END */}

                    {/* SHOW ERROR START  */}
                    {showError && <div className='text-red-600 mt-1'>
                        Size selection is required
                    </div>}
                    {/* SHOW ERROR END */}


                    {/* ADD TO CART BUTTON START  */}
                    <button className='w-full py-4 rounded-full bg-black text-white
                    text-lg font-medium transition-transform active:scale-95 mb-3 hover:opacity-75'
                    onClick={() => {
                        if(!selectedSize){
                            setShowError(true)
                            document.getElementById("sizesGrid").scrollIntoView({
                                block: "center",
                                behavior: "smooth"
                            })
                        }else{
                            dispatch(addToCart({
                                ...product?.data?.[0],
                                selectedSize,
                                oneQuantityPrice: p.price,
                            }))
                            notify()
                        }
                    }
                    }
                    >
                        Add to cart
                    </button>
                    {/* ADD TO CART BUTTON END */}


                    {/* WISHLIST START  */}
                    <button className='w-full py-4 rounded-full border border-black text-lg 
                    font-medium transition-transform flex active:scale-95 items-center 
                    justify-center gap-2 hover:opacity-75 mb-10'>
                        Wishlist
                        <IoMdHeartEmpty size={20}/>
                    </button>
                    {/* WISHLIST END */}

                    <div>
                        <div className='text-lg font-bold mb-5'>
                            Product details
                        </div>
                        <div className='markdown text-md mb-5'>
                            <ReactMarkdown>
                                {p.description}
                            </ReactMarkdown>
                        </div>
                    </div>


                </div>
                {/* PRODUCT PRICE RANGE END  */}

            </div>
            {/* right col end */}

        </div>

        <RelatedProducts products={products}/>


        </Wrapper>

    </div>
  )
}

export default ProductDetails

export async function getStaticPaths() {
    const products = await fetchDataFromApi("/api/products?populate=*")
    
    const paths = products.data.map((p) => ({
        params: {
            slug: p.attributes.slug
        }
    }))

    return {
        paths,
        fallback: false
    }
}

export async function getStaticProps({params: {slug}}) {

    const product = await fetchDataFromApi(`/api/products?populate=*&filters[slug][$eq]=${slug}`)
    
    const products = await fetchDataFromApi(`/api/products?populate=*&[filters][slug][$ne]=${slug}`)

    return {
        props: {
            product,
            products,
        }
    }
}

