import { Button } from '@/components/ui/button'
import { LuSearch } from 'react-icons/lu'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'

function SearchInput({
  className,
  search,
  setSearch
}: {
  className?: string
  search: string
  setSearch: (search: string) => void
}) {
  return (
    <div className={cn(
      search.length > 0 && '!w-full',
      'relative flex items-center  h-[55px] w-full md:w-[55px] hover:w-full overflow-hidden group transition-all duration-300 bg-white shadow rounded-[16px] hover:bg-gray-50',
      )}>
      <Button variant="outline" className={cn('absolute left-1 top-0 z-10 border-none  bg-transparent hover:bg-transparent shadow-none h-full ', className)}>
        <LuSearch className='size-6' />
      </Button>
      <Input 
        type="text" 
        placeholder="Search" 
        className={cn(search.length > 0 && '!block', 'md:hidden block group-hover:block h-full pl-12 rounded-[16px]' )} 
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </div>
  )
}

export default SearchInput