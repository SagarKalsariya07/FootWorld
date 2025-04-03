import PropTypes from "prop-types";
import { useEffect, useState } from "react"
import './Slider_quant.css'

const Slider_quant = ({ intialquantity, productid, onQuantityChange, resetTrigger }) => {
  const [quantity, setQuantity] = useState(intialquantity || 1);
  const handleChange = (e) => {
    const newQuantity = Number(e.target.value)
    setQuantity(newQuantity);
    onQuantityChange(productid, newQuantity)
  }
  useEffect(() => {
    setQuantity(1);
  }, [resetTrigger])
  return (
    <>
      <div className="sliderdiv">
        <p className="text-lg font-semibold">Quantity: {quantity}</p>
        <input
          title="Slide to increase quantity"
          type="range"
          min="1"
          max="50"
          value={quantity}
          onChange={handleChange}
          className="cursor-pointer slider"
        />
      </div>
    </>
  )
}

Slider_quant.propTypes = {
  intialquantity: PropTypes.string,
  productid: PropTypes.string.isRequired, 
  onQuantityChange: PropTypes.func.isRequired,
  resetTrigger: PropTypes.number.isRequired,
};
export default Slider_quant;
