'use server'

import { db } from "@/lib/db"

export const getProduct = async (id: string) => {
  try {
    const product = await db.product.findUnique({
      where: { id },
      include: {
        images: true,
        reviews: true,
      },
    });
    return product;
  } catch (error) {
    console.error(error);
    return null;
  }
};


// export const createProduct = async (name: string, desctiption : string, price: number , isFeatured: boolean,image:string) => {
//     try {
//         const product = await db.product.create({
//             data:{
//                 name:name,
//                 image:image,
//                 description:desctiption,
//                 price:price,
//                 isFeatured:isFeatured
//             }
//         })
//         return product
//     } catch (error) {
//         console.log(error)
//     }
// }

export const getAllProducts = async () => {
    try {
      // @ts-ignore
        const products = await db.product.findMany();
        return products;
    } catch (error) {
        console.log(error);
    }
}