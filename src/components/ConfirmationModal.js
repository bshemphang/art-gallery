'use client';

import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { ExclamationTriangleIcon, CheckCircleIcon, TrashIcon } from '@heroicons/react/24/outline';

export default function ConfirmationModal({ 
  isOpen, 
  onClose, 
  onConfirm,
  type = 'delete', 
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel'
}) {
  const getIcon = () => {
    switch (type) {
      case 'delete':
        return <TrashIcon className="h-12 w-12 text-red-600" />;
      case 'sold':
        return <CheckCircleIcon className="h-12 w-12 text-green-600" />;
      default:
        return <ExclamationTriangleIcon className="h-12 w-12 text-amber-600" />;
    }
  };

  const getConfirmButtonColor = () => {
    switch (type) {
      case 'delete':
        return 'bg-red-600 hover:bg-red-700 focus:ring-red-500';
      case 'sold':
        return 'bg-green-600 hover:bg-green-700 focus:ring-green-500';
      default:
        return 'bg-amber-600 hover:bg-amber-700 focus:ring-amber-500';
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div className="text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                    {getIcon()}
                  </div>
                  
                  <Dialog.Title as="h3" className="mt-4 text-xl font-semibold text-gray-900">
                    {title}
                  </Dialog.Title>
                  
                  <div className="mt-3">
                    <p className="text-gray-600">{message}</p>
                  </div>
                </div>

                <div className="mt-8 flex justify-center gap-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="inline-flex justify-center rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                  >
                    {cancelText}
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => {
                      onConfirm();
                      onClose();
                    }}
                    className={`inline-flex justify-center rounded-lg px-5 py-2.5 text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 ${getConfirmButtonColor()}`}
                  >
                    {confirmText}
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}