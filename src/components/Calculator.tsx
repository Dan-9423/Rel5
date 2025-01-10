import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export default function Calculator() {
  const [display, setDisplay] = useState('0');
  const [operation, setOperation] = useState('');
  const [firstNumber, setFirstNumber] = useState('');

  const handleNumber = (num: string) => {
    setDisplay(display === '0' ? num : display + num);
  };

  const handleOperation = (op: string) => {
    setFirstNumber(display);
    setOperation(op);
    setDisplay('0');
  };

  const calculate = () => {
    const num1 = parseFloat(firstNumber);
    const num2 = parseFloat(display);
    let result = 0;

    switch (operation) {
      case '+':
        result = num1 + num2;
        break;
      case '-':
        result = num1 - num2;
        break;
      case '*':
        result = num1 * num2;
        break;
      case '/':
        result = num1 / num2;
        break;
    }

    setDisplay(result.toString());
    setOperation('');
    setFirstNumber('');
  };

  const clear = () => {
    setDisplay('0');
    setOperation('');
    setFirstNumber('');
  };

  return (
    <div className="grid grid-cols-4 gap-2">
      <div className="col-span-4 bg-gray-100 dark:bg-gray-800 p-4 rounded mb-2 text-right text-2xl">
        {display}
      </div>
      
      <Button variant="outline" onClick={clear} className="col-span-2">AC</Button>
      <Button variant="outline" onClick={() => handleOperation('/')}>/</Button>
      <Button variant="outline" onClick={() => handleOperation('*')}>×</Button>
      
      {[7, 8, 9].map((num) => (
        <Button key={num} variant="outline" onClick={() => handleNumber(num.toString())}>
          {num}
        </Button>
      ))}
      <Button variant="outline" onClick={() => handleOperation('-')}>-</Button>
      
      {[4, 5, 6].map((num) => (
        <Button key={num} variant="outline" onClick={() => handleNumber(num.toString())}>
          {num}
        </Button>
      ))}
      <Button variant="outline" onClick={() => handleOperation('+')}>+</Button>
      
      {[1, 2, 3].map((num) => (
        <Button key={num} variant="outline" onClick={() => handleNumber(num.toString())}>
          {num}
        </Button>
      ))}
      <Button variant="outline" onClick={calculate} className="row-span-2">=</Button>
      
      <Button variant="outline" onClick={() => handleNumber('0')} className="col-span-2">0</Button>
      <Button variant="outline" onClick={() => handleNumber('.')}>.</Button>
    </div>
  );
}