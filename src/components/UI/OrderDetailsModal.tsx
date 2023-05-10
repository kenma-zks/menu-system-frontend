import {
  Divider,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  VStack,
} from "@chakra-ui/react";
import { IOrderData } from "../../types/types";

interface orderDetailsModalProps {
  order: IOrderData | undefined;
  onClose: () => void;
}

const OrderDetailsModal = ({ order, onClose }: orderDetailsModalProps) => {
  return (
    <Modal isOpen={true} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Text pb="2">Order #{order?.order_id}</Text>
          <Text pb="2" fontSize={"xs"} fontWeight={"semibold"} color={"gray"}>
            Ordered Date: {order?.ordered_date} | Ordered Time:{" "}
            {order?.ordered_time?.split(":").slice(0, 2).join(":")}
          </Text>
          <Divider borderBottomWidth={"2px"} borderColor={"gray"} />
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <HStack alignItems="flex-start" justifyContent="space-between">
            <Text fontSize="sm" fontWeight="semibold">
              Customer Name :
            </Text>
            <VStack>
              <Text fontSize="sm" fontWeight="semibold" color="gray">
                {order?.user_name}
              </Text>
            </VStack>
          </HStack>
          <HStack alignItems="flex-start" justifyContent="space-between">
            <Text fontSize="sm" fontWeight="semibold">
              Table No :
            </Text>
            <VStack>
              <Text fontSize="sm" fontWeight="semibold" color="gray">
                {order?.table_no}
              </Text>
            </VStack>
          </HStack>
          <Divider my="4" borderBottomWidth={"2px"} borderColor={"gray"} />
          <HStack alignItems="flex-start" justifyContent="space-between">
            <Text fontSize="sm" fontWeight="semibold">
              Ordered Items :
            </Text>
            <VStack alignItems="flex-end">
              {order?.items.map((item) => (
                <Text
                  key={item.food_id}
                  fontSize="sm"
                  fontWeight="semibold"
                  color="gray"
                >
                  {item.food_name} x {item.quantity}
                </Text>
              ))}
            </VStack>
          </HStack>
          <Divider my="4" borderBottomWidth={"2px"} borderColor={"gray"} />
          <HStack alignItems="flex-start" justifyContent="space-between">
            <Text fontSize="sm" fontWeight="semibold">
              Additional Notes :
            </Text>
            <Text fontSize="sm" fontWeight="semibold" color="gray">
              {order?.note}
            </Text>
          </HStack>
          <Divider my="4" borderBottomWidth={"2px"} borderColor={"gray"} />
          <HStack alignItems="flex-start" justifyContent="space-between">
            <Text fontSize="sm" fontWeight="semibold">
              Total Price :
            </Text>
            <Text fontSize="sm" fontWeight="semibold" color="gray">
              Rs {order?.total_price}
            </Text>
          </HStack>
          <Divider my="4" borderBottomWidth={"2px"} borderColor={"gray"} />
          <HStack pb="4" alignItems="flex-start" justifyContent="space-between">
            <Text fontSize="sm" fontWeight="semibold">
              Payment Method :
            </Text>
            <Text fontSize="sm" fontWeight="semibold" color="gray">
              {order?.payment_method}
            </Text>
          </HStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default OrderDetailsModal;
