import React from 'react';
import { motion } from 'motion/react';
import { GameState, Accessory, RoomItem } from '../types';
import { ShoppingBag, Check, Sparkles, Coins, X } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

interface ShopPanelProps {
  gameState: GameState;
  onPurchaseAccessory: (id: string) => void;
  onEquipAccessory: (id: string) => void;
  onPurchaseRoomItem: (id: string) => void;
  onEquipRoomItem: (id: string) => void;
  onClose: () => void;
}

export default function ShopPanel({
  gameState,
  onPurchaseAccessory,
  onEquipAccessory,
  onPurchaseRoomItem,
  onEquipRoomItem,
  onClose,
}: ShopPanelProps) {
  const { t, lang } = useLanguage();
  const [activeTab, setActiveTab] = React.useState<'accessories' | 'room'>('accessories');

  return (
    <div className="fixed inset-0 bg-[#3D2B24]/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ scale: 0.94, opacity: 0, y: 10 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.94, opacity: 0, y: 10 }}
        className="w-full max-w-lg bg-white rounded-[28px] overflow-hidden shadow-[0_12px_36px_rgba(61,43,36,0.14)] border border-[#F4D396] flex flex-col max-h-[85vh] font-montserrat"
      >
        {/* Shop Header */}
        <div className="bg-[#FFF8EE] border-b border-[#F4D396]/60 p-4.5 text-[#3D2B24] flex justify-between items-center">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-[14px] bg-[#FFF0D4] border border-[#F4D396] flex items-center justify-center text-[#F4B942]">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-base text-[#3D2B24]">{t('shopTitle')}</h3>
              <p className="text-[11px] text-[#806F66]">{t('shopSubtitle')}</p>
            </div>
          </div>
          {/* Coins indicator & close */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-white border border-[#F4D396] px-3.5 py-1.5 rounded-full font-medium text-xs text-[#3D2B24] shadow-2xs">
              <Coins className="w-4 h-4 text-[#F4B942] fill-[#F4B942]" />
              <span>{gameState.coins}</span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-[#806F66] hover:text-[#3D2B24] hover:bg-[#FFF0D4] transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-[#F4D396]/40 p-2 bg-[#FFFDF9] gap-2">
          <button
            onClick={() => setActiveTab('accessories')}
            className={`flex-1 py-2 rounded-[16px] text-xs font-medium transition-all cursor-pointer ${
              activeTab === 'accessories'
                ? 'bg-[#FFF8EE] text-[#3D2B24] shadow-xs border border-[#F4D396]'
                : 'text-[#806F66] hover:bg-[#FFF8EE]/50'
            }`}
          >
            {t('tabAccessories')}
          </button>
          <button
            onClick={() => setActiveTab('room')}
            className={`flex-1 py-2 rounded-[16px] text-xs font-medium transition-all cursor-pointer ${
              activeTab === 'room'
                ? 'bg-[#FFF8EE] text-[#3D2B24] shadow-xs border border-[#F4D396]'
                : 'text-[#806F66] hover:bg-[#FFF8EE]/50'
            }`}
          >
            {t('tabDecoration')}
          </button>
        </div>

        {/* Shop Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 bg-[#FFFDF9]">
          {activeTab === 'accessories' ? (
            <div className="grid grid-cols-2 gap-3">
              {gameState.accessories.map((item) => {
                const isEquipped = Object.values(gameState.currentAccessory).includes(item.id);
                return (
                  <div
                    key={item.id}
                    className="bg-white border border-[#F4D396]/50 rounded-[22px] p-3.5 flex flex-col justify-between gap-3 relative shadow-[0_2px_8px_rgba(90,56,40,0.03)] hover:border-[#F4B942] transition-colors"
                  >
                    {/* Icon Circle */}
                    <div className="flex items-start justify-between">
                      <span className="text-3xl bg-[#FFF8EE] p-2 rounded-[16px] border border-[#F4D396]/40">{item.icon}</span>
                      {item.category === 'collar' && (
                        <div 
                          className="w-4 h-4 rounded-full border-2 border-white shadow-xs mt-1"
                          style={{ backgroundColor: item.color }}
                        />
                      )}
                    </div>

                    {/* Metadata */}
                    <div>
                      <h4 className="font-semibold text-[#3D2B24] text-xs">{item.name}</h4>
                      <p className="text-[10px] text-[#806F66] uppercase tracking-wider font-medium mt-0.5">{item.category}</p>
                    </div>

                    {/* Purchase/Equip Buttons */}
                    <div className="pt-2 border-t border-[#F4D396]/30">
                      {item.purchased ? (
                        <button
                          onClick={() => onEquipAccessory(item.id)}
                          className={`w-full py-2 rounded-[16px] text-[11px] font-medium flex items-center justify-center gap-1 transition-all cursor-pointer ${
                            isEquipped
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : 'bg-[#FFF8EE] text-[#3D2B24] border border-[#F4D396] hover:bg-[#FFF0D4]'
                          }`}
                        >
                          {isEquipped ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-700" /> {t('equipped')}
                            </>
                          ) : (
                            t('equip')
                          )}
                        </button>
                      ) : (
                        <button
                          onClick={() => onPurchaseAccessory(item.id)}
                          disabled={gameState.coins < item.price}
                          className={`w-full py-2 rounded-[16px] text-[11px] font-medium flex items-center justify-center gap-1 transition-all cursor-pointer ${
                            gameState.coins >= item.price
                              ? 'bg-[#F4B942] text-[#3D2B24] hover:bg-[#FFD477] border border-[#E29E2E]'
                              : 'bg-stone-100 text-stone-400 border border-stone-200 cursor-not-allowed'
                          }`}
                        >
                          <Coins className="w-3 h-3 fill-current" />
                          <span>{item.price} {t('coins')}</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {gameState.roomItems.map((item) => {
                const isEquipped = gameState.currentRoom.bed === item.id || gameState.currentRoom.bowl === item.id;
                return (
                  <div
                    key={item.id}
                    className="bg-white border border-[#F4D396]/50 rounded-[22px] p-3.5 flex flex-col justify-between gap-3 relative shadow-[0_2px_8px_rgba(90,56,40,0.03)] hover:border-[#F4B942] transition-colors"
                  >
                    {/* Icon Circle */}
                    <div className="flex items-start justify-between">
                      <span className="text-3xl bg-[#FFF8EE] p-2 rounded-[16px] border border-[#F4D396]/40">{item.icon}</span>
                    </div>

                    {/* Metadata */}
                    <div>
                      <h4 className="font-semibold text-[#3D2B24] text-xs">{item.name}</h4>
                      <p className="text-[10px] text-[#806F66] uppercase tracking-wider font-medium mt-0.5">{item.category}</p>
                    </div>

                    {/* Purchase/Equip Buttons */}
                    <div className="pt-2 border-t border-[#F4D396]/30">
                      {item.purchased ? (
                        <button
                          onClick={() => onEquipRoomItem(item.id)}
                          className={`w-full py-2 rounded-[16px] text-[11px] font-medium flex items-center justify-center gap-1 transition-all cursor-pointer ${
                            isEquipped
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : 'bg-[#FFF8EE] text-[#3D2B24] border border-[#F4D396] hover:bg-[#FFF0D4]'
                          }`}
                        >
                          {isEquipped ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-700" /> {t('equipped')}
                            </>
                          ) : (
                            t('equip')
                          )}
                        </button>
                      ) : (
                        <button
                          onClick={() => onPurchaseRoomItem(item.id)}
                          disabled={gameState.coins < item.price}
                          className={`w-full py-2 rounded-[16px] text-[11px] font-medium flex items-center justify-center gap-1 transition-all cursor-pointer ${
                            gameState.coins >= item.price
                              ? 'bg-[#F4B942] text-[#3D2B24] hover:bg-[#FFD477] border border-[#E29E2E]'
                              : 'bg-stone-100 text-stone-400 border border-stone-200 cursor-not-allowed'
                          }`}
                        >
                          <Coins className="w-3 h-3 fill-current" />
                          <span>{item.price} {t('coins')}</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer / Exit */}
        <div className="p-4 bg-[#FFF8EE] border-t border-[#F4D396]/40 flex justify-end">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 rounded-[18px] bg-[#3D2B24] text-white font-medium text-xs hover:bg-[#5A3828] transition-colors cursor-pointer shadow-xs"
          >
            {t('backToGolden')}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

