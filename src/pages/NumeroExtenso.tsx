import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

function numeroParaExtenso(numero: number, tipo: 'monetaria' | 'numerica'): string {
  const unidades = ['', 'um', 'dois', 'três', 'quatro', 'cinco', 'seis', 'sete', 'oito', 'nove'];
  const dezADezenove = ['dez', 'onze', 'doze', 'treze', 'quatorze', 'quinze', 'dezesseis', 'dezessete', 'dezoito', 'dezenove'];
  const dezenas = ['', '', 'vinte', 'trinta', 'quarenta', 'cinquenta', 'sessenta', 'setenta', 'oitenta', 'noventa'];
  const centenas = ['', 'cento', 'duzentos', 'trezentos', 'quatrocentos', 'quinhentos', 'seiscentos', 'setecentos', 'oitocentos', 'novecentos'];
  const milhares = ['', 'mil', 'milhão', 'bilhão', 'trilhão'];
  const milharesPlural = ['', 'mil', 'milhões', 'bilhões', 'trilhões'];

  if (numero === 0) return 'zero';
  if (numero === 100) return 'cem';

  function converterGrupo(n: number): string {
    let resultado = '';
    
    // Centenas
    const centena = Math.floor(n / 100);
    if (centena > 0) {
      resultado += centenas[centena];
      n %= 100;
      if (n > 0) resultado += ' e ';
    }
    
    // Dezenas e unidades
    if (n >= 10 && n < 20) {
      resultado += dezADezenove[n - 10];
    } else {
      const dezena = Math.floor(n / 10);
      if (dezena > 0) {
        resultado += dezenas[dezena];
        n %= 10;
        if (n > 0) resultado += ' e ';
      }
      if (n > 0) {
        resultado += unidades[n];
      }
    }
    
    return resultado;
  }

  function converterNumeroCompleto(n: number): string {
    if (n === 0) return 'zero';
    
    let resultado = '';
    let i = 0;
    
    while (n > 0) {
      const grupo = n % 1000;
      if (grupo > 0) {
        const conversaoGrupo = converterGrupo(grupo);
        if (i > 0) {
          if (grupo === 1) {
            resultado = milhares[i] + ' ' + resultado;
          } else {
            resultado = conversaoGrupo + ' ' + milharesPlural[i] + ' ' + resultado;
          }
        } else {
          resultado = conversaoGrupo;
        }
      }
      n = Math.floor(n / 1000);
      i++;
    }
    
    return resultado.trim();
  }

  if (tipo === 'monetaria') {
    const partes = numero.toString().split('.');
    const reais = parseInt(partes[0]);
    const centavos = partes.length > 1 ? parseInt(partes[1].padEnd(2, '0')) : 0;

    let resultado = '';

    if (reais > 0) {
      resultado += converterNumeroCompleto(reais);
      resultado += reais === 1 ? ' real' : ' reais';
    }

    if (centavos > 0) {
      if (reais > 0) resultado += ' e ';
      resultado += converterNumeroCompleto(centavos);
      resultado += centavos === 1 ? ' centavo' : ' centavos';
    }

    if (reais === 0 && centavos === 0) {
      resultado = 'zero reais';
    }

    return resultado;
  } else {
    return converterNumeroCompleto(Math.floor(numero));
  }
}

export default function NumeroExtenso() {
  const [unidade, setUnidade] = useState<'monetaria' | 'numerica'>('monetaria');
  const [formato, setFormato] = useState<'lowercase' | 'uppercase' | 'capitalize'>('lowercase');
  const [valor, setValor] = useState('');
  const [resultado, setResultado] = useState('');
  const [valorNumerico, setValorNumerico] = useState<number>(0);

  const formatarValor = (value: string, tipoUnidade: 'monetaria' | 'numerica' = unidade) => {
    // Remove tudo exceto números
    let numerico = value.replace(/\D/g, '');
    
    // Se estiver vazio, retorna vazio
    if (!numerico) return '';
    
    // Converte para número
    const numero = parseInt(numerico);
    
    if (tipoUnidade === 'monetaria') {
      // Formata como moeda
      return (numero / 100).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
    } else {
      // Formata como número
      return numero.toLocaleString('pt-BR');
    }
  };

  const handleValorChange = (inputValue: string) => {
    // Remove formatação atual
    let limpo = inputValue.replace(/\D/g, '');
    
    // Se estiver vazio, limpa o campo
    if (!limpo) {
      setValor('');
      setValorNumerico(0);
      setResultado('');
      return;
    }
    
    // Converte para número
    const numero = parseInt(limpo);
    setValorNumerico(numero);
    
    // Formata o valor para exibição
    const formatado = formatarValor(limpo);
    setValor(formatado);
    
    // Calcula o número para conversão por extenso
    const numeroParaConverter = unidade === 'monetaria' ? numero / 100 : numero;
    
    // Gera o texto por extenso
    let texto = numeroParaExtenso(numeroParaConverter, unidade);
    
    // Aplica o formato de texto selecionado
    switch (formato) {
      case 'uppercase':
        texto = texto.toUpperCase();
        break;
      case 'capitalize':
        texto = texto.split(' ').map(word => 
          word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        ).join(' ');
        break;
      default:
        texto = texto.toLowerCase();
    }
    
    setResultado(texto);
  };

  const handleUnidadeChange = (novaUnidade: 'monetaria' | 'numerica') => {
    setUnidade(novaUnidade);
    
    // Reprocessa o valor atual com a nova unidade
    if (valorNumerico > 0) {
      const numeroString = valorNumerico.toString();
      const formatado = formatarValor(numeroString, novaUnidade);
      setValor(formatado);
      
      // Calcula o número para conversão por extenso
      const numeroParaConverter = novaUnidade === 'monetaria' ? valorNumerico / 100 : valorNumerico;
      
      // Gera o texto por extenso
      let texto = numeroParaExtenso(numeroParaConverter, novaUnidade);
      
      // Aplica o formato de texto selecionado
      switch (formato) {
        case 'uppercase':
          texto = texto.toUpperCase();
          break;
        case 'capitalize':
          texto = texto.split(' ').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
          ).join(' ');
          break;
        default:
          texto = texto.toLowerCase();
      }
      
      setResultado(texto);
    }
  };

  const handleFormatoChange = (novoFormato: 'lowercase' | 'uppercase' | 'capitalize') => {
    setFormato(novoFormato);
    if (resultado) {
      let novoTexto = resultado.toLowerCase();
      switch (novoFormato) {
        case 'uppercase':
          novoTexto = novoTexto.toUpperCase();
          break;
        case 'capitalize':
          novoTexto = novoTexto.split(' ').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
          ).join(' ');
          break;
      }
      setResultado(novoTexto);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Número por Extenso</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <Label>1. Qual a unidade?</Label>
            <RadioGroup
              value={unidade}
              onValueChange={(value: 'monetaria' | 'numerica') => handleUnidadeChange(value)}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="monetaria" id="monetaria" />
                <Label htmlFor="monetaria">Monetária (R$)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="numerica" id="numerica" />
                <Label htmlFor="numerica">Numérica (número simples)</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-3">
            <Label>2. Qual o tipo de letra?</Label>
            <RadioGroup
              value={formato}
              onValueChange={(value: 'lowercase' | 'uppercase' | 'capitalize') => handleFormatoChange(value)}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="lowercase" id="lowercase" />
                <Label htmlFor="lowercase">Minúsculas</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="uppercase" id="uppercase" />
                <Label htmlFor="uppercase">Maiúsculas</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="capitalize" id="capitalize" />
                <Label htmlFor="capitalize">Primeira Letra Maiúscula</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-3">
            <Label>3. Valor</Label>
            <Input
              value={valor}
              onChange={(e) => handleValorChange(e.target.value)}
              placeholder={unidade === 'monetaria' ? 'R$ 0,00' : '0'}
            />
          </div>

          <div className="space-y-2">
            <Label>Resultado</Label>
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg min-h-[100px]">
              {resultado || <span className="text-gray-400">Digite um valor para ver o resultado</span>}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}