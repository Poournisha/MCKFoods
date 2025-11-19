import React, { useState, useEffect } from 'react';
import { Calculator, Copy, History, Info, Check, X, ArrowLeftRight, Undo } from 'lucide-react';

// Conversion rates to square meters (base unit)
const unitConversions = {
  'square-meter': 1,
  'square-kilometer': 1000000,
  'square-foot': 0.092903,
  'square-yard': 0.836127,
  'acre': 4046.86,
  'hectare': 10000,
  'square-mile': 2589988.11,
  'square-centimeter': 0.0001,
  'square-millimeter': 0.000001,
  'square-inch': 0.00064516,
  'ping': 3.305785, // 坪
  'mu': 666.67, // 亩
  'qing': 66667 // 顷
};

type Unit = keyof typeof unitConversions;

const unitLabels: Record<Unit, string> = {
  'square-meter': '平方米 (m²)',
  'square-kilometer': '平方公里 (km²)',
  'square-centimeter': '平方厘米 (cm²)',
  'square-millimeter': '平方毫米 (mm²)',
  'square-foot': '平方英尺 (ft²)',
  'square-yard': '平方码 (yd²)',
  'square-inch': '平方英寸 (in²)',
  'acre': '英亩 (ac)',
  'hectare': '公顷 (ha)',
  'square-mile': '平方英里 (mi²)',
  'ping': '坪',
  'mu': '亩',
  'qing': '顷'
};

// 常用换算值
const commonValues = [
  { value: 1, label: '1' },
  { value: 10, label: '10' },
  { value: 100, label: '100' },
  { value: 1000, label: '1000' },
  { value: 10000, label: '10000' },
];

// 常用单位组合
const commonUnitPairs = [
  { from: 'square-meter', to: 'square-kilometer', label: '平方米 ↔ 平方公里' },
  { from: 'square-meter', to: 'hectare', label: '平方米 ↔ 公顷' },
  { from: 'mu', to: 'hectare', label: '亩 ↔ 公顷' },
  { from: 'square-meter', to: 'ping', label: '平方米 ↔ 坪' },
];

interface HistoryEntry {
  inputValue: string;
  inputUnit: Unit;
  outputUnit: Unit;
  result: number;
  timestamp: Date;
}

function App() {
  const [inputValue, setInputValue] = useState<string>('1');
  const [inputUnit, setInputUnit] = useState<Unit>('square-meter');
  const [outputUnit, setOutputUnit] = useState<Unit>('square-kilometer');
  const [result, setResult] = useState<number>(0);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [precision, setPrecision] = useState<number>(4);
  const [copySuccess, setCopySuccess] = useState(false);

  const convertArea = (value: number, from: Unit, to: Unit): number => {
    if (isNaN(value)) return 0;
    const baseValue = value * unitConversions[from];
    return baseValue / unitConversions[to];
  };

  useEffect(() => {
    const numValue = parseFloat(inputValue);
    if (!isNaN(numValue)) {
      const converted = convertArea(numValue, inputUnit, outputUnit);
      setResult(converted);

      if (numValue > 0) {
        const newEntry: HistoryEntry = {
          inputValue,
          inputUnit,
          outputUnit,
          result: converted,
          timestamp: new Date()
        };
        setHistory(prev => [newEntry, ...prev].slice(0, 10));
      }
    } else {
      setResult(0);
    }
  }, [inputValue, inputUnit, outputUnit]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || !isNaN(parseFloat(value))) {
      setInputValue(value);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(formatResult(result));
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const formatResult = (value: number) => {
    return value.toLocaleString('zh-CN', {
      maximumFractionDigits: precision,
      minimumFractionDigits: 0
    });
  };

  // 交换输入和输出单位
  const swapUnits = () => {
    setInputUnit(outputUnit);
    setOutputUnit(inputUnit);
  };

  // 重置为默认值
  const resetToDefault = () => {
    setInputValue('1');
    setInputUnit('square-meter');
    setOutputUnit('square-kilometer');
    setPrecision(4);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-3xl">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Calculator className="w-8 h-8 text-indigo-600" />
            <h1 className="text-2xl font-bold text-gray-800">面积单位换算器</h1>
          </div>
          <div className="flex gap-2">
            <button
              onClick={resetToDefault}
              title="重置为默认值"
              className="p-2 text-gray-600 hover:text-indigo-600 rounded-lg hover:bg-indigo-50"
            >
              <Undo className="w-5 h-5" />
            </button>
            <button
              onClick={() => setShowInfo(!showInfo)}
              className="p-2 text-gray-600 hover:text-indigo-600 rounded-lg hover:bg-indigo-50"
            >
              <Info className="w-5 h-5" />
            </button>
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="p-2 text-gray-600 hover:text-indigo-600 rounded-lg hover:bg-indigo-50"
            >
              <History className="w-5 h-5" />
            </button>
          </div>
        </div>

        {showInfo && (
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <div className="flex justify-between items-start">
              <h3 className="font-medium text-gray-800 mb-2">换算说明</h3>
              <button
                onClick={() => setShowInfo(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• 1 平方公里 = 1,000,000 平方米</li>
              <li>• 1 公顷 = 10,000 平方米</li>
              <li>• 1 英亩 ≈ 4,046.86 平方米</li>
              <li>• 1 平方英里 ≈ 2,589,988.11 平方米</li>
              <li>• 1 坪 ≈ 3.306 平方米</li>
              <li>• 1 亩 ≈ 666.67 平方米</li>
              <li>• 1 顷 = 100 亩</li>
            </ul>
          </div>
        )}

        {/* 常用值快捷选择 */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">常用值：</label>
          <div className="flex flex-wrap gap-2">
            {commonValues.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => setInputValue(value.toString())}
                className="px-3 py-1 text-sm bg-gray-100 hover:bg-indigo-100 text-gray-700 hover:text-indigo-700 rounded-full transition-colors"
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">输入值</label>
              <input
                type="number"
                value={inputValue}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="输入数值"
                min="0"
                step="any"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">输入单位</label>
              <select
                value={inputUnit}
                onChange={(e) => setInputUnit(e.target.value as Unit)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                {Object.entries(unitLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 单位交换按钮 */}
          <div className="flex justify-center">
            <button
              onClick={swapUnits}
              className="p-2 text-indigo-600 hover:text-indigo-700 rounded-full hover:bg-indigo-50"
              title="交换单位"
            >
              <ArrowLeftRight className="w-6 h-6" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">转换结果</label>
              <div className="relative">
                <input
                  type="text"
                  value={formatResult(result)}
                  readOnly
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg pr-10"
                />
                <button
                  onClick={handleCopy}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-indigo-600"
                  title="复制结果"
                >
                  {copySuccess ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">输出单位</label>
              <select
                value={outputUnit}
                onChange={(e) => setOutputUnit(e.target.value as Unit)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                {Object.entries(unitLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 常用单位组合 */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">常用单位组合：</label>
            <div className="flex flex-wrap gap-2">
              {commonUnitPairs.map((pair, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setInputUnit(pair.from as Unit);
                    setOutputUnit(pair.to as Unit);
                  }}
                  className="px-3 py-1 text-sm bg-gray-100 hover:bg-indigo-100 text-gray-700 hover:text-indigo-700 rounded-full transition-colors"
                >
                  {pair.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">小数位数</label>
            <input
              type="range"
              min="0"
              max="8"
              value={precision}
              onChange={(e) => setPrecision(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="text-sm text-gray-600 text-center">{precision} 位小数</div>
          </div>
        </div>

        {showHistory && (
          <div className="mt-8 border-t pt-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium text-gray-800">转换历史</h3>
              <button
                onClick={() => setHistory([])}
                className="text-sm text-gray-500 hover:text-red-500"
              >
                清除历史
              </button>
            </div>
            <div className="space-y-2">
              {history.length === 0 ? (
                <p className="text-sm text-gray-500 text-center">暂无历史记录</p>
              ) : (
                history.map((entry, index) => (
                  <div
                    key={index}
                    className="text-sm p-2 bg-gray-50 rounded-lg flex justify-between items-center"
                  >
                    <span>
                      {entry.inputValue} {unitLabels[entry.inputUnit]} = {' '}
                      {formatResult(entry.result)} {unitLabels[entry.outputUnit]}
                    </span>
                    <span className="text-gray-400">
                      {entry.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <h2 className="text-sm font-medium text-gray-700 mb-2">支持的单位换算：</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-gray-600">
            {Object.values(unitLabels).map((label) => (
              <div key={label} className="flex items-center gap-2">
                <span className="w-2 h-2 bg-indigo-400 rounded-full"></span>
                {label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;