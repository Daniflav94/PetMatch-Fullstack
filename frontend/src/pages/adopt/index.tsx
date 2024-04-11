import * as S from "./styles";
import { FilterAdopt } from "./components/filter";
import { IPet } from "../../interfaces/IPet";
import { Card } from "../../components/card/card";
import { Pagination } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { ModalLoginRequired } from "./components/modalLoginRequired";
import * as Dialog from "@radix-ui/react-dialog";
import {
  getListFavorites,
  listPetsWithPagination,
} from "../../services/pet.service";
import { HeartCrack } from "lucide-react";
import { getRequestsUser } from "../../services/requestAdoption.service";
import { IFormAdoption } from "../../interfaces/IFormAdoption";
import { getCurrentUser } from "../../services/auth.service";
import { IOrganization } from "../../interfaces/IOrganization";
import { IUser } from "../../interfaces/IUser";

interface PetFavorite {
  pet: IPet;
  idUser: string;
}

export function Adopt() {
  const [pets, setPets] = useState<IPet[]>([]);
  const [petsFavorites, setPetsFavorites] = useState<PetFavorite[]>([]);
  const [token, setToken] = useState('');
  const [user, setUser] = useState<IOrganization | IUser>();
  const [totalList, setTotalList] = useState(1);
  const [filteredPets, setFilteredPets] = useState<IPet[]>([]);
  const [notFoundMessage, setNotFoundMessage] = useState("");
  const [listRequestAdoption, setListRequestAdoption] = useState<IFormAdoption[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {  
      setToken(token); 
      getFavorites(token);
      getRequestsAdoptionUser(token);
    }

    getUser();
    getPets(1);
  }, []);

  useEffect(() => {
    const total = filteredPets.length / 8;
    setTotalList(Math.ceil(Number(total.toFixed(1))));
  }, [filteredPets]);

  async function getUser() {
    const res = await getCurrentUser(token);

    setUser(res.data);
  }

  const filtered =
    filteredPets.length >= 1
      ? filteredPets.filter((pet) => {
          return pets.filter((i) => pet.id === i.id);
        })
      : pets;

  async function getPets(page: number) {
    const res = await listPetsWithPagination(page);

    if (res.data) {
      setPets(res.data);
      const total = res.total / 8;
      setTotalList(Math.ceil(Number(total.toFixed(1))));
    }
  }

  async function getFavorites(id: string) {
    const res = await getListFavorites(id);

    if (res.data) {
      setPetsFavorites(res.data);
    }
  }

  async function getRequestsAdoptionUser(token: string) {
    const res = await getRequestsUser(token);

    if (res.data) {
      setListRequestAdoption(res.data);
    }
  }


  return (
    <Dialog.Root>
      <S.Container>
        <FilterAdopt setFilteredPets={setFilteredPets} setNotFoundMessage={setNotFoundMessage} token={token} />
        {notFoundMessage != "" && (
          <S.Error>
            <span>{notFoundMessage}</span>
            <HeartCrack color="brown" />
          </S.Error>
        )}
        {!token ? (
          <Dialog.Trigger>
            <S.ContainerCards>
              {filtered.map((pet) => (
                <Card key={pet.id} pet={pet} />
              ))}
            </S.ContainerCards>
          </Dialog.Trigger>
        ) : (
          <S.ContainerCards>
            {filtered.map((pet) => (
              <Card
                key={pet.id}
                pet={pet}
                typeUser={user?.type}
                token={token}
                favorites={petsFavorites}
                listRequestAdoption={listRequestAdoption}
              />
            ))}
          </S.ContainerCards>
        )}

        <S.Pagination>
          <Pagination
            total={totalList}
            initialPage={1}
            color="warning"
            onChange={(page: number) => getPets(page)}
          />
        </S.Pagination>
      </S.Container>
      <ModalLoginRequired />
    </Dialog.Root>
  );
}
