import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
  } from "@/components/ui/tooltip"
  import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input";
import { useAppStore } from "@/store";
  
const NewDM = () => {
  const {setSelectedChatType, setSelectedChatData} = useAppStore()
    const [openNewContactModel, setOpenNewContactModel] = useState(false); 
    const [searchedContacts, setSearchedContacts] = useState([]);
    const searchContacts = async (searchTerm)=>{

    } 

    const selectNewContact =(contact)=>{
      setOpenNewContactModel(false)
      setSelectedChatType("contact")
      setSelectedChatData(contact)
      setSearchedContacts([]) 
    }
  return (
    <><TooltipProvider>
    <Tooltip>
      <TooltipTrigger><FaPlus className="text-neutral-400 font-light text-opacity-90 text-start hover:text-neutral-100 cursor-pointer transition-all duration-300" onClick={()=>{
        setOpenNewContactModel(true)
      }}/></TooltipTrigger>
      <TooltipContent className="bg-[#1c1b1e] border-none mb-2 p-3 text-white ">
        <p>Select New Contact</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
  <Dialog open={openNewContactModel} onOpenChange={() => setOpenNewContactModel(false)}>
  <DialogContent className="bg-[#181920] border-none text-white  w-[400px] h-[400px] flex flex-col" >
    <DialogHeader>
      <DialogTitle>  Please Select a Contact</DialogTitle>
    </DialogHeader>
    <div>
        <Input placeholder="Search Contact" className="rounded-lg p-6 bg-[#2c2e3b] border-none " onChange={e=> searchContacts(e.target.value)}/>
    </div>
    {
        searchContacts.length <= 0 &&     <div className="flex-1 md:bg-[#1c1d25] md:flex flex-col justify-center mt-5 items-center  duration-1000 transition-all">
        <Lottie isClickToPauseDisabled={true} height={100} width={100} options={animationDefaultOptions}/>
          <div className="text-opacity-80 text-white flex flex-col gap-5 items-center mt-5  lg:text-2xl text-xl transition-all duration-300 text-center">
              <h3 className="poppins-medium">
                  hi <span className="text-purple-500">Search New Contact</span>
              </h3>
          </div>
      </div>
    }
  </DialogContent>

</Dialog>

  </>
  )
}
export default NewDM