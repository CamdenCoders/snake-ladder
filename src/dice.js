import { Row } from 'react-bootstrap';
import './dice.css';


function Dice() {
  return (<>
    <div class="min-h-screen bg-gray-100 flex items-center justify-center">
  <div class="h-36 w-36 bg-white rounded-xl shadow-xl transform rotate-3 flex justify-between p-4 hover:scale-150 transition duration-700 hover:rotate-45 hover:shadow-2xl">
    <div class="space-y-4 pt-1">
      <div class="w-6 h-6 bg-gray-700 rounded-full"></div>
      <div class="w-6 h-6 bg-gray-700 rounded-full"></div>
      <div class="w-6 h-6 bg-gray-700 rounded-full"></div>
    </div>
    <div class="space-y-4 pt-1">
      <div class="w-6 h-6 bg-gray-700 rounded-full"></div>
      <div class="w-6 h-6 bg-gray-700 rounded-full"></div>
      <div class="w-6 h-6 bg-gray-700 rounded-full"></div>
    </div>
    <div class="space-y-4 pt-1">
      <div class="w-6 h-6 bg-gray-700 rounded-full"></div>
      <div class="w-6 h-6 bg-gray-700 rounded-full"></div>
      <div class="w-6 h-6 bg-gray-700 rounded-full"></div>
    </div>
  </div>
</div>
<Row></Row>
  </>
  );
}

export default Dice;

