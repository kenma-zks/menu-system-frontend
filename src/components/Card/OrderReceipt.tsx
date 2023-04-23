import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Text,
  Divider,
  HStack,
  VStack,
  ModalFooter,
  Button,
} from "@chakra-ui/react";
import { IOrderData } from "../../types/types";
import jsPDF from "jspdf";
import { useRef } from "react";

interface OrderReceiptProps {
  order: IOrderData;
  onClose: () => void;
}

const OrderReceipt = ({ order, onClose }: OrderReceiptProps) => {
  const modalContentRef = useRef<HTMLDivElement>(null);

  const generatePDF = () => {
    const doc = new jsPDF();

    if (modalContentRef.current) {
      doc.html(modalContentRef.current, {
        callback: function (pdf) {
          pdf.save("order.pdf");
        },
      });
      doc.save("order-receipt.pdf");
    } else {
      console.log("Modal content not found");
    }
  };

  return (
    <Modal isOpen={true} onClose={onClose}>
      <ModalOverlay />
      <ModalContent w={"400px"} ref={modalContentRef}>
        <ModalHeader>
          <Text pb="2">Order #{order.order_id}</Text>
          <Text pb="2" fontSize={"xs"} fontWeight={"semibold"} color={"gray"}>
            Ordered Date: {order.ordered_date} | Ordered Time:{" "}
            {order.ordered_time.split(":").slice(0, 2).join(":")}
          </Text>
          <Divider borderBottomWidth={"2px"} borderColor={"gray"} />
        </ModalHeader>

        <ModalCloseButton />
        <ModalBody>
          <HStack alignItems="flex-start" justifyContent="space-between">
            <Text fontSize="sm" fontWeight="semibold">
              Ordered Items :
            </Text>
            <VStack alignItems="flex-end">
              {order.items.map((item) => (
                <Text fontSize="sm" fontWeight="semibold" color="gray">
                  {item.food_name} x {item.quantity}
                </Text>
              ))}
            </VStack>
          </HStack>
          <Divider my="4" borderBottomWidth={"2px"} borderColor={"gray"} />
          <HStack alignItems="flex-start" justifyContent="space-between">
            <Text fontSize="sm" fontWeight="semibold">
              Total Price :
            </Text>
            <Text fontSize="sm" fontWeight="semibold" color="gray">
              Rs {order.total_price}
            </Text>
          </HStack>
          <Divider my="4" borderBottomWidth={"2px"} borderColor={"gray"} />
          <HStack pb="4" alignItems="flex-start" justifyContent="space-between">
            <Text fontSize="sm" fontWeight="semibold">
              Payment Method :
            </Text>
            <Text fontSize="sm" fontWeight="semibold" color="gray">
              {order.payment_method}
            </Text>
          </HStack>
        </ModalBody>
        {/* <ModalFooter>
          <Button w={"100%"} onClick={generatePDF}>
            Create a PDF
          </Button>
        </ModalFooter> */}
      </ModalContent>
    </Modal>
  );
};

export default OrderReceipt;
