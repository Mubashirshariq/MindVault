import Button from "./components/Button"
import ShareIcon from "./icons/shareIcon"
import { PlusIcon } from "./icons/plusIcon"
import Card from "./components/Card"

function App() {
  

  return (
    <div className="min-h-screen bg-gray-200">
     {/* <Button text="Share Brain" variant="secondary" icon={<ShareIcon/>}/>
     <Button text="Add Content" variant="primary" icon={<PlusIcon/>}/> */}
     <Card type="twitter" title="first video" description="hey there this is my first video" link="https://x.com/HumansNoContext/status/1863974018388295974"/>
     <Card type="youtube" title="first video" description="hey there this is my first video" link="https://www.youtube.com/watch?v=1damIEq1Pxg&list=RD1damIEq1Pxg&start_radio=1"/>
    </div>
  )
}

export default App
