import { Mail, MailOpen } from "lucide-react";
import { INotification } from "../../../../interfaces/INotification";
import { ModalContentNotification } from "../modalContentNotification";
import * as S from "./styles";
import * as Dialog from "@radix-ui/react-dialog";
import { IUser } from "../../../../interfaces/IUser";
import { IOrganization } from "../../../../interfaces/IOrganization";
import { uploads } from "../../../../utils/config";
import { IPet } from "../../../../interfaces/IPet";

type Props = {
  notification: INotification;
  markAsViewed: (id: string) => void;
  listNotifications: () => void;
};

export function Notification({
  notification,
  markAsViewed,
  listNotifications,
}: Props) {
  const date = new Date(notification.createdAt as Date).toLocaleDateString(
    "pt-BR"
  );
 
  return (
    <Dialog.Root>
      <S.Container>
        {notification.type === "request_adoption" ? (
          <S.ContentNotification>
            <S.Img
              src={`${uploads}/pets/${notification.formAdoption?.pet?.photo}`}
              alt=""
            />
            <S.ContainerText>
              <S.Title>Solicitação de adoção</S.Title>
              <S.Date>{date}</S.Date>
              <S.Description>
                {(notification.formAdoption?.user as IUser).name.split(" ")[0]}{" "}
                gostaria de adotar{" "}
                {(notification.formAdoption?.pet as IPet).name}
              </S.Description>
              {notification.wasApproved && (
                <S.Success>Adoção aprovada!</S.Success>
              )}
              {notification.wasApproved === false && (
                <S.Denied>Adoção recusada!</S.Denied>
              )}

              <Dialog.Trigger>
                <S.Button
                  onClick={() => markAsViewed(notification.id as string)}
                >
                  Ver formulário
                </S.Button>
              </Dialog.Trigger>
            </S.ContainerText>
            {notification.isViewed ? (
              <MailOpen color="#969696" size={20} />
            ) : (
              <Mail color="#969696" size={20} />
            )}
          </S.ContentNotification>
        ) : (
          <>
            <S.ContentNotification>
              <S.Img
                src={`${uploads}/pets/${notification.formAdoption?.pet?.photo}`}
                alt=""
              />
              <S.ContainerText>
                {notification.wasApproved && <S.Title>Adoção aprovada</S.Title>}
                {notification.wasApproved === false && (
                  <S.Title>Adoção recusada</S.Title>
                )}
                <S.Date>
                  {date}
                </S.Date>
                <S.Description>
                  {
                    ((notification.formAdoption?.pet as IPet)
                        .organization as IOrganization
                    ).name
                  }{" "}
                  respondeu seu pedido de adoção para{" "}
                  {(notification.formAdoption?.pet as IPet).name}
                </S.Description>

                <Dialog.Trigger>
                  <S.Button
                    onClick={() => markAsViewed(notification.id as string)}
                    data-testid="button-see-more-notification"
                  >
                    Ver mais
                  </S.Button>
                </Dialog.Trigger>
              </S.ContainerText>
              {notification.isViewed ? (
                <MailOpen color="#969696" size={20} />
              ) : (
                <Mail color="#969696" size={20} />
              )}
            </S.ContentNotification>
          </>
        )}
      </S.Container>
      <ModalContentNotification
        data={notification}
        listNotifications={listNotifications}
      />
    </Dialog.Root>
  );
}
