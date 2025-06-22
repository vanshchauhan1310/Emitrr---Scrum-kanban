import React, { Suspense } from 'react'
import { BarLoader } from 'react-spinners'

const Projectlayout = ({children}: {children: React.ReactNode}) => {
  return (
    <div className='mx-auto'>
        <Suspense fallback={<BarLoader color='#36d7b7'  width={"100%"} height={4}/>}>
            {children}
        </Suspense>
    </div>
  )
}

export default Projectlayout