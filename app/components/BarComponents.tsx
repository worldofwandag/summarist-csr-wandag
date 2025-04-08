'use client';

import { usePathname } from 'next/navigation';
import Searchbar from './Searchbar';
import Sidebar from './Sidebar';

const BarComponents = () => {
    const pathname = usePathname();

    // Check for the root or choose-plan path
    const isRootOrChoosePlan = pathname === '/' || pathname === '/choose-plan';

    return (
        <>
            {!isRootOrChoosePlan && <Searchbar />}
            {!isRootOrChoosePlan && <Sidebar />}
        </>
    );
};

export default BarComponents;