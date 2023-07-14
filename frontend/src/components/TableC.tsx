// import React from 'react'

import { useContext, useEffect, useState } from "react";
import { UserContext } from "../contexts/UserContext";
import { Button } from "./ui/button";
// import { Input } from "./ui/input";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTrigger } from "./ui/dialog";
import { DialogDescription, DialogTitle } from "@radix-ui/react-dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";

interface ContactType {
    id: number
    first_name: string
    last_name: string
    phone_no: string
    email: string
    is_search: boolean
}

export default function TableC() {
    const { token } = useContext<any>(UserContext);
    const [data1, setData1] = useState<ContactType[]>([]);
    const [errorMessage, setErrorMessage] = useState("");
    const [query, setQuery] = useState<string>("");

    const fetchContacts = async () => {
        const response = await fetch("http://localhost:8000/contacts/", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token
            }
        })
        const responseJSON = await response.json();
        if (!response.ok) {
            alert("Sorry, Not Working")
        } else {

            setData1(responseJSON);
        }

    }

    useEffect(() => {
        fetchContacts()

    }, [])

    const addContact = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        const firstName = formData.get("firstName")?.toString();
        const lastName = formData.get("lastName")?.toString();
        const Email = formData.get("email")?.toString();
        const phoneNo = formData.get("phoneNo")?.toString();


        // let dataForm = {}
        // formData.forEach((value, key) => {
        //     c
        // })

        if (
            typeof firstName === "string" && typeof lastName === "string" && typeof Email === "string" && typeof phoneNo === "string"
        ) {
            // (first_name.length > 0 || first_name.length > 0) &&

            const response = await fetch("http://localhost:8000/contacts/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + token
                },
                body: JSON.stringify({
                    first_name: firstName,
                    last_name: lastName,
                    email: Email,
                    phone_no: phoneNo
                }),
            })

            const responseJSON = await response.json();

            if (response.status === 400) {

                setErrorMessage(responseJSON.detail)
            } else if (response.status === 422) {
                const field: string = responseJSON.detail[0].loc[1]

                if (field === "first_name") {

                    setErrorMessage(`Invalid First Name!`)
                } else if (field === "last_name") {
                    setErrorMessage("invalid Last Name!")
                } else if (field === "email") {
                    setErrorMessage("invalid email!")
                } else if (field === "phone_no") {
                    setErrorMessage("invalid Phone No.")
                } else {
                    setErrorMessage("invalid details!")
                }
            } else if (!responseJSON.detail) {
                const copy = [...data1]
                const dataAdd: ContactType = {
                    id: responseJSON.id,
                    email: Email,
                    first_name: firstName,
                    last_name: lastName,
                    phone_no: phoneNo,
                    is_search: false
                }

                copy.splice(data1.length, 0, dataAdd)
                setData1(copy)
                // alert("Added Contact Successfully!")
            } else {
                setErrorMessage(responseJSON.detail)
            }




        } else {
            setErrorMessage("Invalid details!")
        }
    }

    const delContact = async (contactId: number) => {
        const response = await fetch(`http://localhost:8000/contacts/${contactId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token
            },
        })

        if (response.ok) {

            const index = data1.findIndex((value) => value.id === contactId)
            const copy = [...data1]
            copy.splice(index, 1)
            setData1(copy)
        }

        // alert((await response.json()).message)
    }

    const updateContact = async (event: React.FormEvent<HTMLFormElement>, contactId: number) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        const firstName = formData.get("firstName")?.toString();
        const lastName = formData.get("lastName")?.toString();
        const Email = formData.get("email")?.toString();
        const phoneNo = formData.get("phoneNo")?.toString();


        if (
            typeof firstName === "string" && typeof lastName === "string" && typeof Email === "string" && typeof phoneNo === "string"
            && (firstName.trim() !== "" || lastName.trim() !== "" || Email.trim() !== "" || phoneNo.trim() !== "")
        ) {

            const response = await fetch(`http://localhost:8000/contacts/${contactId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + token
                },
                body: JSON.stringify({
                    first_name: firstName,
                    last_name: lastName,
                    email: Email,
                    phone_no: phoneNo
                }),
            })

            const responseJSON = await response.json();

            if (response.status === 400) {

                setErrorMessage(responseJSON.detail)
            } else if (response.status === 422) {
                const field = responseJSON.detail[0].loc[1]

                if (field === "first_name") {

                    setErrorMessage(`Invalid First Name!`)
                } else if (field === "last_name") {
                    setErrorMessage("invalid Last Name!")
                } else if (field === "email") {
                    setErrorMessage("invalid email!")
                } else if (field === "phone_no") {
                    setErrorMessage("invalid Phone No.")
                } else {
                    setErrorMessage("invalid details")
                }
            } else if (response.status === 200) {
                const copy = [...data1]
                const index = data1.findIndex((value) => value.id === contactId)

                const dataUpdate: ContactType = {
                    id: contactId,
                    email: Email,
                    first_name: firstName,
                    last_name: lastName,
                    phone_no: phoneNo,
                    is_search: false
                }

                // copy.f(data1.length, 0, dataAdd)

                copy[index] = dataUpdate;
                setData1(copy);
            }




        } else {
            setErrorMessage("Invalid details!")
        }
    }



    function fetchContactsBySearch(value: string) {
        
        const data1Copy = [...data1];
        setQuery(value);
        if (value !== "") {
            // setSearching(true);
            data1Copy.map((v) => {
                if (v.first_name.toLowerCase().includes(value.toLowerCase())||
                    v.last_name.toLowerCase().includes(value.toLowerCase()) ||
                    v.email.toLowerCase().includes(value.toLowerCase()) ||
                    v.phone_no.toLowerCase().includes(value.toLowerCase())) {
                    v.is_search = true;
                    
                }else{
                    v.is_search=false
                }
            })
        } else {
            
            data1Copy.map((v) => {
                v.is_search=false
            })
        }

        setData1(data1Copy);
        

    }

    return (

        <div className="ml-4 mr-4">
            <Input type="text" placeholder="Search" onChange={(event) => fetchContactsBySearch(event.currentTarget.value.trim())} className=" w-80 ml-2" />
            <Table>
                <TableCaption className="mb-5">

                    <Dialog onOpenChange={() => { setErrorMessage("") }}>
                        <DialogTrigger asChild>

                            <Button variant={"outline"} className=" hover:bg-green-200 bg-green-400 text-white mb-3" >Add new contact</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Add New Contact</DialogTitle>
                                <DialogDescription>
                                    Append a new contact. Click 'Add' when you are done!
                                </DialogDescription>
                            </DialogHeader>
                            <form method="dialog" className="grid gap-4 py-4" onSubmit={addContact}>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="firstName" className="text-right">
                                        First Name
                                    </Label>
                                    <Input id="firstName" name="firstName" className="col-span-3" />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="lastName" className="text-right">
                                        Last Name
                                    </Label>
                                    <Input id="lastName" name="lastName" className="col-span-3" />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="email" className="text-right">
                                        Email
                                    </Label>
                                    <Input id="email" name="email" className="col-span-3" />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="phoneNo" className="text-right">
                                        Phone No.
                                    </Label>
                                    <Input id="phoneNo" name="phoneNo" className="col-span-3" />
                                </div>
                                <p className=" text-red-600">{errorMessage}</p>
                                <DialogFooter>
                                    <Button type="reset">Reset</Button>
                                    <Button type="submit">Add</Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                    <br />
                    {data1.length === 0 ?
                        <p>You don't have any contacts</p>

                        :
                        <p>
                            Your contacts ({data1.length})
                        </p>
                    }
                </TableCaption>

                <TableHeader>
                    <TableRow>
                        <TableHead>First Name</TableHead>
                        <TableHead>Last Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Phone No.</TableHead>
                        <TableHead>Commands</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data1.map((value) => (
                        <TableRow className={ query !== ""?(value.is_search ? "visible" : "hidden"):"visible"} key={`${value.id}`}>
                            <TableCell className="font-medium">{value.first_name}</TableCell>
                            <TableCell className="font-medium">{value.last_name}</TableCell>
                            <TableCell className="font-medium">{value.email}</TableCell>
                            <TableCell className="font-medium">{value.phone_no}</TableCell>

                            <TableCell className="content-center">
                                <Button variant="destructive" onClick={() => delContact(value.id)} className="mr-2">Delete</Button>
                                <Dialog onOpenChange={() => { setErrorMessage("") }}>
                                    <DialogTrigger asChild>
                                        <Button variant="outline" className="bg-slate-200">Edit</Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Edit Contact</DialogTitle>
                                            <DialogDescription>
                                                Make changes to your Contact here. Click save when you're done.
                                            </DialogDescription>
                                        </DialogHeader>

                                        <form onSubmit={(event) => updateContact(event, value.id)} className="grid gap-4 py-4">
                                            <div className="grid grid-cols-4 items-center gap-4">
                                                <Label htmlFor="firstName" className="text-right">
                                                    First Name
                                                </Label>
                                                <Input id="firstName" name="firstName" className="col-span-3" defaultValue={value.first_name} />
                                            </div>
                                            <div className="grid grid-cols-4 items-center gap-4">
                                                <Label htmlFor="lastName" className="text-right">
                                                    Last Name
                                                </Label>
                                                <Input id="lastName" name="lastName" defaultValue={value.last_name} className="col-span-3" />
                                            </div>
                                            <div className="grid grid-cols-4 items-center gap-4">
                                                <Label htmlFor="email" className="text-right">
                                                    Email
                                                </Label>
                                                <Input id="email" name="email" defaultValue={value.email} className="col-span-3" />
                                            </div>
                                            <div className="grid grid-cols-4 items-center gap-4">
                                                <Label htmlFor="phoneNo" className="text-right">
                                                    Phone No.
                                                </Label>
                                                <Input id="phoneNo" name="phoneNo" defaultValue={value.phone_no} className="col-span-3" />
                                            </div>
                                            <p className=" text-red-600">{errorMessage}</p>
                                            <DialogFooter>
                                                <Button type="reset">Reset</Button>
                                                <Button type="submit">Save changes</Button>
                                            </DialogFooter>
                                        </form>
                                    </DialogContent>
                                </Dialog>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div >

    )
}
