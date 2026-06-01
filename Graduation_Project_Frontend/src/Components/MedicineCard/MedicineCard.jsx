
import {X , PenLine , Trash2} from "lucide-react"

export default function MedicineCard({name, dosage , duration , instructions , onDelete  , onEdit }) {

  return <>
    <div className="flex flex-row items-center gap-3 w-fit px-3 py-2 rounded-3xl bg-[#f5fef5] border border-[#d5e6d6] text-[#5A8A5DFF]">
        
            <p className="text-sm font-medium">
            {name} · {dosage} · {duration} . {instructions}
            </p>
            <div className='flex flex-row items-center '>
                <div className='w-8 h-8 rounded-full flex items-center justify-center cursor-pointer' onClick={onEdit}>
                    <PenLine size={15} className='text-[#9196A1FF]' />
                </div>
                <div className='w-8 h-8 rounded-full flex items-center justify-center cursor-pointer' onClick={onDelete}>
                    <Trash2 size={15} className='text-[#C97272FF]' />
                </div>
            </div>

    </div>
  </>
}
